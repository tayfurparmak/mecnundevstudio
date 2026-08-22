export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const method = event.node.req.method

  if (method === 'GET') {
    const notes = await prisma.note.findMany({ orderBy: { updatedAt: 'desc' } })
    return { success: true, notes }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { title, content, tags, isTil } = body

    if (!title || !content) {
      throw createError({ statusCode: 400, statusMessage: 'Başlık ve içerik zorunludur.' })
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || 'General',
        isTil: !!isTil,
      },
    })

    return { success: true, note }
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Geçersiz ID' })

    await prisma.note.delete({ where: { id } })
    return { success: true }
  }
})
