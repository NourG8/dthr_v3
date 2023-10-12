import { useCompanyApi } from '@/composable/useCompanyApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCompany = defineStore('company', () => {
  const api = useCompanyApi()

  const companies_list = ref<any>([])

  async function get_companies() {
    try {
      const response = await api.get_companies();
      companies_list.value = response[0];
      localStorage.setItem('companyData', JSON.stringify(companies_list.value))
    } catch (error) {
      console.error(error);
    }
  }

  return {
    loading: api.loading,
    get_companies,
    companies_list,
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCompany, import.meta.hot))

