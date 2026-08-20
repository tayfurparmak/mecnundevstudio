import type { TaskCategory, TaskStatus } from '@prisma/client'

const VALID_CATEGORIES: TaskCategory[] = ['AI', 'ENGLISH', 'WEB']
const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz görev kimliği (ID).',
    })
  }

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek veri bulunamadı.',
    })
  }

  const updateData: {
    title?: string
    category?: TaskCategory
    status?: TaskStatus
    order?: number
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) {
    updateData.title = body.title.trim()
  }

  if (body.category) {
    const category = body.category.toUpperCase() as TaskCategory
    if (!VALID_CATEGORIES.includes(category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Geçersiz kategori. İzin verilenler: ${VALID_CATEGORIES.join(', ')}`,
      })
    }
    updateData.category = category
  }

  if (body.status) {
    const status = body.status.toUpperCase() as TaskStatus
    if (!VALID_STATUSES.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}`,
      })
    }
    updateData.status = status
  }

  if (typeof body.order === 'number') {
    updateData.order = body.order
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      task,
    }
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Güncellenmek istenen görev bulunamadı.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Görev güncellenirken bir hata oluştu.',
    })
  }
})
