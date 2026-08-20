export default defineNuxtRouteMiddleware(async () => {
  const { authenticated, initialized, fetchUser } = useAuth()

  if (!initialized.value) {
    await fetchUser()
  }

  if (authenticated.value) {
    return navigateTo('/admin')
  }
})
