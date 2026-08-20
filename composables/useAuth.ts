interface AuthUser {
  role: string
}

interface AuthResponse {
  authenticated: boolean
  user: AuthUser | null
}

interface LoginResponse {
  success: boolean
  user: AuthUser
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)
  const initialized = useState<boolean>('auth_initialized', () => false)

  const authenticated = computed(() => !!user.value)

  const fetchUser = async (): Promise<AuthUser | null> => {
    loading.value = true
    try {
      // useRequestFetch ensures cookies are forwarded during SSR
      const customFetch = useRequestFetch()
      const data = await customFetch<AuthResponse>('/api/auth/me')

      if (data && data.authenticated && data.user) {
        user.value = data.user
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }

    return user.value
  }

  const login = async (password: string): Promise<LoginResponse> => {
    loading.value = true
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { password },
      })

      if (response && response.success && response.user) {
        user.value = response.user
        initialized.value = true
        await navigateTo('/admin')
      }

      return response
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      user.value = null
      initialized.value = true
      loading.value = false
      await navigateTo('/login')
    }
  }

  return {
    user: readonly(user),
    authenticated,
    loading: readonly(loading),
    initialized: readonly(initialized),
    fetchUser,
    login,
    logout,
  }
}
