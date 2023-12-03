import { useRoleApi } from '@/composable/useRoleApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useRole = defineStore('role', () => {
    const api = useRoleApi()

    const roles_list = ref<any>([])
    const roles_list_archived = ref<any>([])
    const role = ref<any>([])
    const permissions_list = ref<any>([])
    const nb_personnes = ref()
    const nb_positions = ref()
    const nb_permissions = ref()

    async function get_roles() {
        const response = await api.get_roles();
        roles_list.value = response;
        console.log(roles_list.value)
        console.log("test", api.loading.value)
    }

    async function get_role(payload: any) {
        try {
            const response = await api.get_role(payload);
            role.value = response;
            console.log(role.value)
        } catch (error) {
            console.error(error);
        }
    }

    async function delete_role(payload: any) {
        const response = await api.delete_role(payload)
        const index = roles_list.value.indexOf(payload)

        roles_list.value.splice(index, 1)
    }

    async function update_role(payload: any) {
        const response = await api.update_role(payload)
    }

    async function store_role(payload: any) {
        try {
            const response = await api.store_role(payload)
            roles_list.value.push(payload)
        } catch (error) {
            console.log(error)
        }
    }

    async function archive_role(payload: any) {
        const response = await api.archive_role(payload)
        const index = roles_list.value.indexOf(payload)
        roles_list.value.splice(index, 1)
    }

    async function reset_role(payload: any) {
        const response = await api.reset_role(payload)
        const index = roles_list_archived.value.indexOf(payload)
        roles_list_archived.value.splice(index, 1)
    }

    async function archive_role_with_permissions(payload: any) {
        const response = await api.archive_role_with_permissions(payload)
        const index = roles_list.value.indexOf(payload)
        roles_list.value.splice(index, 1)
    }

    async function get_nb_personnes(payload: any) {
        try {
            const response = await api.get_nb_personnes(payload);
            nb_personnes.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    async function get_nb_positions(payload: any) {
        try {
            const response = await api.get_nb_positions(payload);
            nb_positions.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    async function get_archived_roles() {
        try {
            const response = await api.get_archived_roles();
            roles_list_archived.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    async function get_permissions_role(payload: any) {
        try {
            const response = await api.get_permissions_role(payload);
            permissions_list.value = response;
            nb_permissions.value = response.length
        } catch (error) {
            console.error(error);
        }
    }

    return {
        loading: api.loading,
        get_roles,
        get_role,
        store_role,
        update_role,
        delete_role,
        archive_role,
        reset_role,
        archive_role_with_permissions,
        get_nb_positions,
        get_nb_personnes,
        get_archived_roles,
        get_permissions_role,
        roles_list,
        roles_list_archived,
        role,
        nb_positions,
        nb_personnes,
        permissions_list,
        nb_permissions
    } as const
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useRole, import.meta.hot))

