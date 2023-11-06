import { useRoleApi } from '@/composable/useRoleApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useRole = defineStore('role', () => {
    const api = useRoleApi()

    const roles_list = ref<any>([])
    const roles_positions_list = ref<any>([])

    async function get_roles() {
        try {
            const response = await api.get_roles();
            roles_list.value = response;
            console.log(roles_list.value)
        } catch (error) {
            console.error(error);
        }
    }

    async function get_roles_positions_user(payload: any) {
        try {
            const response = await api.get_roles_positions_user(payload);
            roles_positions_list.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        loading: api.loading,
        get_roles,
        get_roles_positions_user,
        roles_list,
        roles_positions_list
    } as const
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useRole, import.meta.hot))

