export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const method = event.node.req.method

  if (method === 'GET') {
    const [nodes, edges] = await Promise.all([
      prisma.mindMapNode.findMany(),
      prisma.mindMapEdge.findMany(),
    ])
    return { success: true, nodes, edges }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { label, category, x, y, color, description } = body

    if (!label) {
      throw createError({ statusCode: 400, statusMessage: 'Düğüm etiketi zorunludur.' })
    }

    const node = await prisma.mindMapNode.create({
      data: {
        label,
        category: category || 'Core',
        x: x ?? 100,
        y: y ?? 100,
        color: color || '#00f2fe',
        description,
      },
    })

    return { success: true, node }
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Geçersiz ID' })

    await prisma.mindMapNode.delete({ where: { id } })
    await prisma.mindMapEdge.deleteMany({
      where: {
        OR: [{ fromId: id }, { toId: id }],
      },
    })
    return { success: true }
  }
})
