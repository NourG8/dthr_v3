import { useContractApi } from '@/composable/useContractApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useContract = defineStore('contract', () => {
    const api = useContractApi()

    const contracts_list = ref<any>([])

    async function get_contracts() {
        try {
            const response = await api.get_contracts();
            contracts_list.value = response;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        loading: api.loading,
        get_contracts,
        contracts_list,
    } as const
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useContract, import.meta.hot))

