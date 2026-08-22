export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const method = event.node.req.method

  if (method === 'POST') {
    const body = await readBody(event)
    const { fromId, toId } = body
    
    if (!fromId || !toId) {
      throw createError({ statusCode: 400, statusMessage: 'fromId ve toId zorunludur.' })
    }
    
    // Check if edge already exists
    const existing = await prisma.mindMapEdge.findFirst({
      where: { fromId, toId }
    })
    
    if (existing) {
      return { success: true, edge: existing }
    }
    
    const edge = await prisma.mindMapEdge.create({
      data: { fromId, toId }
    })
    
    return { success: true, edge }
  }
  
  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Geçersiz Edge ID' })
    
    await prisma.mindMapEdge.delete({ where: { id } })
    return { success: true }
  }
})
