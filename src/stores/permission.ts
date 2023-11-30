import { usePermissionApi } from '@/composable/usePermissionApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePermission = defineStore('permission', () => {
    const api = usePermissionApi()

    const permissions_list = ref<any>([])
    const permissions_list_archived = ref<any>([])
    const permissions_positions_list = ref<any>([])
    async function get_permissions() {
        const response = await api.get_permissions();
        permissions_list.value = response;
    }

    async function get_permissions_positions_user(payload: any) {
        try {
            const response = await api.get_permissions_positions_user(payload);
            permissions_positions_list.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    async function delete_permission(payload: any) {
        const response = await api.delete_permission(payload)
        const index = permissions_list.value.indexOf(payload)

        permissions_list.value.splice(index, 1)
    }

    async function update_permission(payload: any) {
        const response = await api.update_permission(payload)
    }

    async function store_permission(payload: any) {
        try {
            const response = await api.store_permission(payload)
            permissions_list.value.push(payload)
        } catch (error) {
            console.log(error)
        }
    }

    async function archive_permission(payload: any) {
        const response = await api.archive_permission(payload)
        const index = permissions_list.value.indexOf(payload)
        permissions_list.value.splice(index, 1)
    }

    async function reset_permission(payload: any) {
        const response = await api.reset_permission(payload)
        const index = permissions_list_archived.value.indexOf(payload)
        permissions_list_archived.value.splice(index, 1)
    }

    async function get_archived_permissions() {
        try {
            const response = await api.get_archived_permissions();
            permissions_list_archived.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        loading: api.loading,
        get_permissions,
        get_permissions_positions_user,
        store_permission,
        update_permission,
        delete_permission,
        archive_permission,
        reset_permission,
        get_archived_permissions,
        permissions_list,
        permissions_list_archived,
        permissions_positions_list
    } as const
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePermission, import.meta.hot))

