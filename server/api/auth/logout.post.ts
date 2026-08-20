export default defineEventHandler((event) => {
  clearAdminSession(event)

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
