import { useUserApi } from '@/composable/useUserApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const api = useUserApi()

  const users_list = ref<any>([])
  const list_user_count = ref()

  // async function get_users_list() {
  //   users_list.value = await []
  //   const response = await api.get_users()

  //   list_user_count.value = await response.count
  //   users_list.value = response.data
  //   console.log(users_list.value)
  // }

  async function get_users() {
    try {
      const response = await api.get_users();
      users_list.value = response;
    } catch (error) {
      console.error(error);
    }
  }

  async function get_user(user_id: number) {
    try {
      const response = await api.get_users(user_id);
      users_list.value = response;
      
    } catch (error) {
      console.error(error);
    }
  }

  return {
    loading: api.loading,
    // get_users_list,
    get_users,
    list_user_count,
    users_list,
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))

