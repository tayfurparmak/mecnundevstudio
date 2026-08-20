export default defineEventHandler((event) => {
  requireAdmin(event)

  return {
    success: true,
    message: 'Admin access verified',
  }
})
