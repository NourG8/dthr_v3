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

    async function downloadModelContract(payload: any) {
        const response = await api.downloadModelContract(payload);
    }

    async function downloadContractUser(payload: any) {
        const response = await api.downloadContractUser(payload);
    }

    return {
        loading: api.loading,
        get_contracts,
        downloadModelContract,
        downloadContractUser,
        contracts_list,
    } as const
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useContract, import.meta.hot))

