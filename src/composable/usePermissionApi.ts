/**
 * This is a composable function (reusable component) that handle user api calls.
 *
 * It can be used as standalone to force api call, but it is also used
 * as a part of the userSession pinia store.
 * Note that errors are not catched here, so you need to handle them in your components.
 *
 * The api used is run with the local json-server (yarn dev:json-server)
 *
 * @see /src/stores/permission.ts
 */

import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi'

const router = useRouter()

export const usePermissionApi = createSharedComposable(() => {
    const api = useApi()
    const loading = ref(false)

    async function get_permissions() {
        loading.value = true
        try {
            const { data } = await api.get<any>(`permissions`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_permissions_positions_user(payload: any) {
        loading.value = true
        try {
            const { data } = await api.get<any>(`permissions/positions/users/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function store_permission(payload: any) {
        loading.value = true
        try {
            const { data } = await api.post<any>('/permissions', payload)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function update_permission(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`permissions/${payload.id}`, payload)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function delete_permission(payload: any) {
        loading.value = true
        try {
            const { data } = await api.get<any>(`permissions/delete/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function archive_permission(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`permission/archive/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function reset_permission(payload: any) {
        loading.value = true
        try {
            const { data } = await api.put<any>(`permission/reset/${payload.id}`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    async function get_archived_permissions() {
        loading.value = true
        try {
            const { data } = await api.get<any>(`permission/list/archive`)
            return data
        }
        finally {
            loading.value = false
        }
    }

    return {
        get_permissions,
        get_archived_permissions,
        get_permissions_positions_user,
        store_permission,
        update_permission,
        delete_permission,
        archive_permission,
        reset_permission,
        loading
    } as const
})
