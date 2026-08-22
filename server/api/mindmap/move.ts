export default defineEventHandler(async (event) => {
  requireAdmin(event)
  
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event)
    const { id, x, y } = body
    
    if (!id || x === undefined || y === undefined) {
      throw createError({ statusCode: 400, statusMessage: 'Eksik parametreler.' })
    }
    
    const node = await prisma.mindMapNode.update({
      where: { id },
      data: { x, y }
    })
    
    return { success: true, node }
  }
})
