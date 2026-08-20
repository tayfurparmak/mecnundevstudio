export default defineEventHandler((event) => {
  const isAuthenticated = verifyAdminSession(event)

  if (isAuthenticated) {
    return {
      authenticated: true,
      user: {
        role: 'admin',
      },
    }
  }

  return {
    authenticated: false,
    user: null,
  }
})
