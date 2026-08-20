export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body.password !== 'string' || !body.password.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required',
    })
  }

  const isValid = verifyAdminPassword(body.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  createAdminSession(event)

  return {
    success: true,
    user: {
      role: 'admin',
    },
  }
})
