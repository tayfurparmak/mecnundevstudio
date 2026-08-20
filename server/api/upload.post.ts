import { promises as fs } from 'node:fs'
import path from 'node:path'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const items = await readMultipartFormData(event)
  if (!items || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lütfen yüklenecek bir resim dosyası seçin.',
    })
  }

  const fileItem = items.find((item) => item.name === 'file' || item.filename)
  if (!fileItem || !fileItem.data || !fileItem.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçerli bir resim dosyası bulunamadı.',
    })
  }

  const fileType = fileItem.type?.toLowerCase() || ''
  if (fileType && !ALLOWED_MIME_TYPES.includes(fileType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yalnızca JPEG, PNG, WebP, GIF veya SVG resim formatları desteklenmektedir.',
    })
  }

  if (fileItem.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Resim dosya boyutu 5MB sınırını aşamaz.',
    })
  }

  const ext = path.extname(fileItem.filename).toLowerCase() || '.png'
  const baseName = path.basename(fileItem.filename, ext)
  const sanitizedBase = baseName
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30)
  const uniqueFilename = `img_${Date.now()}_${sanitizedBase || 'upload'}${ext}`

  const uploadDir = path.resolve(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })

  const destinationPath = path.join(uploadDir, uniqueFilename)
  await fs.writeFile(destinationPath, fileItem.data)

  const publicUrl = `/uploads/${uniqueFilename}`

  return {
    success: true,
    url: publicUrl,
    filename: uniqueFilename,
    originalName: fileItem.filename,
    size: fileItem.data.length,
    mimeType: fileType,
  }
})
