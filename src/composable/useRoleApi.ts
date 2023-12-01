/**
 * This is a composable function (reusable component) that handle user api calls.
 *
 * It can be used as standalone to force api call, but it is also used
 * as a part of the userSession pinia store.
 * Note that errors are not catched here, so you need to handle them in your components.
 *
 * The api used is run with the local json-server (yarn dev:json-server)
 *
 * @see /src/stores/role.ts
 */

import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi'

const router = useRouter()

export const useRoleApi = createSharedComposable(() => {
    const api = useApi()
    const loading = ref(false)

    async function get_roles() {
        loading.value = true
        try {
            const { data } = await api.get<any>(`roles`)
            console.log("api", loading.value)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_roles_positions_user(payload: any) {
        loading.value = true
        try {
            const { data } = await api.get<any>(`roles/positions/users/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function store_role(payload: any) {
        loading.value = true
        try {
            const { data } = await api.post<any>('/roles', payload)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function update_role(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`roles/${payload.id}`, payload)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function delete_role(payload: any) {
        loading.value = true
        try {
            const { data } = await api.get<any>(`roles/delete/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_nb_positions(payload: any) {
        // loading.value = true
        try {
            const { data } = await api.get<any>(`role/getNb_Per/${payload.id}`)
            return data
        }
        finally {
            // loading.value = false
        }
    }

    async function get_nb_personnes(payload: any) {
        // loading.value = true
        try {
            const { data } = await api.get<any>(`role/getNb_Pos/${payload.id}`)
            return data
        }
        finally {
            // loading.value = false
        }
    }

    async function archive_role(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`role/archive/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function reset_role(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`role/reset/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function archive_role_with_permissions(payload: any) {
        loading.value = true
        try {
            const { data } = await api.get<any>(`archive/rolePermissions/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_archived_roles() {
        loading.value = true
        try {
            const { data } = await api.get<any>(`role/list/archive`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_permissions_role(payload: any) {
        // loading.value = true
        try {
            const { data } = await api.get<any>(`permission/role/${payload.id}`)
            return data
        }
        finally {
            // loading.value = false
        }
    }

    return {
        get_roles,
        get_archived_roles,
        get_roles_positions_user,
        store_role,
        update_role,
        delete_role,
        archive_role,
        reset_role,
        archive_role_with_permissions,
        get_nb_positions,
        get_nb_personnes,
        get_permissions_role,
        loading
    } as const
})
