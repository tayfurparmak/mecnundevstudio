export function slugify(text: string): string {
  if (!text) return ''

  const turkishCharMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  }

  let slug = text
    .split('')
    .map((char) => turkishCharMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with -
    .replace(/-+/g, '-')       // Replace multiple hyphens with single -
    .replace(/^-+|-+$/g, '')   // Trim leading/trailing hyphens

  return slug || 'post'
}

export async function generateUniquePostSlug(
  title: string,
  customSlug?: string,
  excludePostId?: number
): Promise<string> {
  const baseSlug = customSlug ? slugify(customSlug) : slugify(title)
  let candidateSlug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.post.findFirst({
      where: {
        slug: candidateSlug,
        ...(excludePostId ? { id: { not: excludePostId } } : {}),
      },
      select: { id: true },
    })

    if (!existing) {
      return candidateSlug
    }

    counter++
    candidateSlug = `${baseSlug}-${counter}`
  }
}
