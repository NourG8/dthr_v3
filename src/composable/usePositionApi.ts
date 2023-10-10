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

export const usePositionApi = createSharedComposable(() => {
  const api = useApi()
  const loading = ref(false)

  async function get_positions() {
    loading.value = true
    try {
      const { data } = await api.get<any>(`positions`)
      return data
    }
    finally {
      loading.value = false
    }
  }
  
  return {
    get_positions,
    loading
  } as const
})
