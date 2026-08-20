export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const id = typeof body?.id === 'number' ? body.id : null

  if (!id || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz not ID.',
    })
  }

  try {
    const note = await prisma.learningNote.findUnique({
      where: { id },
    })

    if (!note) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Öğrenme notu bulunamadı.',
      })
    }

    const slug = await generateUniquePostSlug(note.title)

    // Create post in Post table
    const post = await prisma.post.create({
      data: {
        title: note.title,
        slug,
        content: note.content,
        isPublished: true,
      },
    })

    // Update note status
    const updatedNote = await prisma.learningNote.update({
      where: { id },
      data: {
        status: 'PUBLIC',
        postId: post.id,
      },
    })

    return {
      success: true,
      note: updatedNote,
      post,
      message: 'Öğrenme notu başarıyla blog yazısı olarak yayınlandı.',
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Blog yazısına dönüştürülürken bir hata oluştu.',
    })
  }
})
