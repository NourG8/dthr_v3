import { usePositionApi } from '@/composable/usePositionApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePosition = defineStore('position', () => {
  const api = usePositionApi()

  const positions_list = ref<any>([])

  async function get_positions() {
    try {
      const response = await api.get_positions();
      positions_list.value = response;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    loading: api.loading,
    get_positions,
    positions_list,
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePosition, import.meta.hot))

