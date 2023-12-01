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

export const useContractApi = createSharedComposable(() => {
  const api = useApi()
  const loading = ref(false)

  async function get_contracts() {
    loading.value = true
    try {
      const { data } = await api.get<any>(`contracts`)
      return data
    }
    finally {
      loading.value = false
    }
  }

  async function downloadModelContract(payload: any) {
    loading.value = true;
    try {
      const { data } = await api.get<any>(`/user/download/old_contract/${payload.contract.id}`, { responseType: 'blob' });

      if (data) {
        const blob = new Blob([data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = "contract_" + payload.contract.type + "_" + payload.user.last_name + "_" + payload.user.first_name + ".docx"
        link.click()
        URL.revokeObjectURL(link.href)
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      loading.value = false;
    }
  }

  async function downloadContractUser(payload: any) {
    loading.value = true;
    try {
      const { data } = await api.get<any>(`/user_contract/download/${payload.id}`, { responseType: 'blob' });

      const blob = new Blob([data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = payload.fileContract
      link.click()
      URL.revokeObjectURL(link.href)

    } catch (error) {
      console.error("Error", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    get_contracts,
    downloadModelContract,
    downloadContractUser,
    loading
  } as const
})
