export default defineNuxtRouteMiddleware(async (to) => {
  const path = to.path.toLowerCase()
  const isAdminRoute = path === '/admin' || path.startsWith('/admin/')
  const isLoginRoute = path === '/login' || path.startsWith('/login/')

  if (!isAdminRoute && !isLoginRoute) {
    return
  }

  const { authenticated, initialized, fetchUser } = useAuth()

  if (!initialized.value) {
    await fetchUser()
  }

  if (isAdminRoute && !authenticated.value) {
    return navigateTo('/login')
  }

  if (isLoginRoute && authenticated.value) {
    return navigateTo('/admin')
  }
})
