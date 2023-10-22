/**
 * This is a composable function (reusable component) that handle user api calls.
 *
 * It can be used as standalone to force api call, but it is also used
 * as a part of the userSession pinia store.
 * Note that errors are not catched here, so you need to handle them in your components.
 *
 * The api used is run with the local json-server (yarn dev:json-server)
 *
 * @see /src/stores/user.ts
 */

import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi'

const router = useRouter()

export interface User {
  id: number
  lastName: string
  firstName: string
  image: string
  sex: string
  address: string
  role: string
  nationality: string
  gender: string
  dateBirth: Date
  placeBirth: string
  status: string
  email: string
  password: string
  gsm: string
}

export const useUserApi = createSharedComposable(() => {
  const api = useApi()
  const loading = ref(false)

  async function get_users() {
    loading.value = true
    try {
      const { data } = await api.get<User>(`users`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  async function get_user(id_user: number) {
    loading.value = true
    try {
      const { data } = await api.get<User>(`users/${id_user}`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  
  async function store_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.post<any>('/users', payload)
      return data
    }
    finally {
      loading.value = false
    }
  }
  
  async function update_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.put<any>(`users/${payload.id}`, payload)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function delete_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.delete<any>(`users/${payload.id}`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function login({ email, password }) {
    loading.value = true
    
    try {
      //   let count = 0
      const { data } = await api.post<any>('login', {
        email,
        password,
      })
      
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      // const { data } = await api.post<any>('logout')

      // Remove "userData" from localStorage
      localStorage.removeItem('userData')

      // Remove "token" from localStorage
      localStorage.removeItem('token')

      // Remove "accessToken" from localStorage
      localStorage.removeItem('accessToken')

      // // Redirect to login page
      // router.push('/login')
      // router.push('/')
      // router.replace("/");

      // // Remove "userAbilities" from localStorage
      // localStorage.removeItem('userAbilities')

      //   if ('X-Total-Count' in headers) {
      //     count = parseInt(headers['X-Total-Count'])
      //   }
      // return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function forgotPassword({ email }) {
    loading.value = true

    try {
      const { data } = await api.post<any>('forgot-password', { email })

      //   if ('X-Total-Count' in headers) {
      //     count = parseInt(headers['X-Total-Count'])
      //   }
      return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function verifCode({ code }) {
    loading.value = true

    try {
      const { data } = await api.post<any>('users/verif-code', {
        code
      })

      return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function updatePassword({ old_password, password, password_confirmation }) {
    loading.value = true

    try {
      const { data } = await api.post<any>('update-password', {
        old_password,
        password,
        password_confirmation,
      })

      //   if ('X-Total-Count' in headers) {
      //     count = parseInt(headers['X-Total-Count'])
      //   }
      return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function resetPassword({ password, password_confirmation, code }) {
    loading.value = true

    try {
      const { data } = await api.post<any>('users/reset-password', {
        password,
        password_confirmation,
        code
      })
      return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function me() {
    loading.value = true

    try {
      const { data } = await api.get<any>('me')
      
      return data.data
    }
    finally {
      loading.value = false
    }
  }

  async function updatePicture({ image }) {
    loading.value = true
    try {
      const { data } = await api.patch<any>('users/update-picture', { image })
      return data
    }
    finally {
      loading.value = false
    }
  }

  return {
    get_users,
    get_user,
    store_user,
    update_user,
    delete_user,
    logout,
    login,
    loading,
    forgotPassword,
    updatePassword,
    resetPassword,
    me,
    verifCode,
    updatePicture
  } as const
})
