import { useUserApi } from '@/composable/useUserApi'
import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const route = useRoute()
  const router = useRouter()
  const api = useUserApi()
  const token = useStorage('token', '')
  const user = ref(JSON.parse(localStorage.getItem('userData') || 'null'))
  const loading = ref(true)
  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  async function login(payload) {
    const response = await api.login(payload)

    user.value = response.user
    token.value = response.token

    // localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
    // ability.update(userAbilities);

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : '/')

    return response
  }

  async function me() {
    return await api.me()
  }

  // async function register(payload) {
  //   return await api.register(payload)

  //   // user.value = newUser
  //   // token.value = newToken
  // }

  async function logout() {
    const response = await api.logout()

    user.value = undefined
    token.value = undefined

    return response
  }

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  const getUserData = computed(() => {
    return user.value
  })

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
  }

  async function forgotPassword(payload) {
    return await api.forgotPassword(payload)
  }

  async function verifCode(payload) {
    return await api.verifCode(payload)
  }

  async function resetPassword(payload) {
    return await api.resetPassword(payload)
  }

  async function updatePicture(payload) {
    const response = await api.updatePicture(payload)
    return response;
  }

  return {
    user: user.value,
    token,
    isLoggedIn,
    loading: api.loading,
    logoutUser,
    setUser,
    setToken,
    setLoading,
    login,
    me,
    // register,
    logout,
    forgotPassword,
    resetPassword,
    verifCode,
    updatePicture
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))

