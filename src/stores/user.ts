import { useUserApi } from '@/composable/useUserApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const api = useUserApi()

  const users_list = ref<any>([])
  const list_user_count = ref()

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

  async function delete_user(payload: any) {
    const response = await api.delete_user(payload)
    const index = users_list.value.indexOf(payload)

    users_list.value.splice(index, 1)
  }

  async function update_user(payload: any) {
    const response = await api.update_user(payload)
  }

  async function store_user(payload: any) {
    const response = await api.store_user(payload)

    users_list.value.push(payload)
  }

  return {
    loading: api.loading,
    store_user,
    update_user,
    delete_user,
    // get_users_list,
    get_users,
    list_user_count,
    users_list,
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))

