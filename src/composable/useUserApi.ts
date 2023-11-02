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
      const { data } = await api.get<any>(`users`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function get_archive_user() {
    loading.value = true
    try {
      const { data } = await api.get<any>(`user/list/archive`)

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
      const { data } = await api.get<any>(`users/delete/${payload.id}`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function archive_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.put<any>(`user/archive/${payload.id}`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function unarchive_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.put<any>(`user/reset/${payload.id}`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function reset_pwd_user(payload: any) {
    loading.value = true
    try {
      const { data } = await api.put<any>(`admin/reset/password/${payload.id}`)
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

  async function get_user_contracts(id_user: number) {
    loading.value = true
    try {
      const { data } = await api.get<User>(`user/contract/${id_user}`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  async function get_user_contracts_model(id_user: number) {
    loading.value = true
    try {
      const { data } = await api.get<User>(`users/model/${id_user}`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  async function get_user_contracts_signed(id_user: number) {
    loading.value = true
    try {
      const { data } = await api.get<any>(`users/contract/${id_user}`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  async function affect_contract_user(payload: any) {
    loading.value = true;
    try {
      const { data } = await api.post<any>(`affectContracts`, payload.contract, { responseType: 'blob' });

      if (payload.contract.download != null) {
        // Vérifiez si la réponse a des données avant de les déstructurer
        if (data && data.data) {
          const blob = new Blob([data.data], { type: 'application/pdf' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)

          if (payload.contract.download == 'word') {
            link.download = "contract_" + payload.contract.type + "_" + payload.user.lastName + payload.user.firstName + ".docx"
          } else if (payload.contract.download == 'pdf') {
            link.download = "contract_" + payload.contract.type + "_" + payload.user.lastName + payload.user.firstName + ".pdf"
          }

          link.click()
          URL.revokeObjectURL(link.href)
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
    } finally {
      loading.value = false;
    }
  }

  async function upload_old_file_contract(payload: any) {
    loading.value = true;
    try {
      let formData = new FormData();
      formData.append('file', payload.file);
      formData.append('contract_id', payload.contract.contract_id);
      formData.append('startDate', payload.contract.startDate);
      if (payload.contract.endDate != "") {
        formData.append('endDate', payload.contract.endDate);
      }

      const { data } = await api.post<any>(`user/upload/old_contract/${payload.id_user}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

    } catch (error) {
      console.error("Erreur", error);
    } finally {
      loading.value = false;
    }
  }

  async function edit_contract_user(payload: any) {
    let formData = new FormData();
    formData.append('file', payload.contract.fileContract);
    formData.append('contract_id', payload.contract.contract_id);
    formData.append('user_id', payload.contract.user_id);
    formData.append('startDate', payload.contract.startDate);
    formData.append('endDate', payload.contract.endDate);
    formData.append('salary', payload.contract.salary);
    formData.append('status', payload.contract.status);
    formData.append('date_status', payload.contract.date_status);
    formData.append('raison', payload.contract.raison);
    formData.append('placeOfWork', payload.contract.placeOfWork);
    formData.append('startTimeWork', payload.contract.startTimeWork);
    formData.append('endTimeWork', payload.contract.endTimeWork);
    formData.append('trialPeriod', payload.contract.trialPeriod);
    formData.append('fileContract', payload.fileContract);

    const { data } = await api.post<any>(`editContractUser/${payload.contract.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

    if (payload.contract.download != null) {
      const blob = new Blob([data.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      if (payload.contract.download == 'word') {
        link.download = "contract_" + payload.contract.type + "_" + payload.user.lastName + payload.user.firstName + ".docx"
      } else if (payload.contract.download == 'pdf') {
        link.download = "contract_" + payload.contract.type + "_" + payload.user.lastName + payload.user.firstName + ".pdf"
      }
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }

  async function delete_contract(payload: any) {
    loading.value = true
    try {
      const { data } = await api.put<any>(`user_contract/delete/${payload.id}`)

      return data
    }
    finally {
      loading.value = false
    }
  }

  return {
    get_users,
    store_user,
    update_user,
    delete_user,
    archive_user,
    unarchive_user,
    reset_pwd_user,
    get_archive_user,
    get_user_contracts,
    get_user_contracts_model,
    get_user_contracts_signed,
    affect_contract_user,
    upload_old_file_contract,
    edit_contract_user,
    delete_contract,
    logout,
    login,
    loading,
    forgotPassword,
    updatePassword,
    resetPassword,
    me,
    verifCode,
    updatePicture,
  } as const
})
