import { useDepartmentApi } from '@/composable/useDepartmentApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDepartment = defineStore('department', () => {
  const api = useDepartmentApi()

  const departments_list = ref<any>([])
  const team_list = ref<any>([])

  async function get_departments() {
    try {
      const response = await api.get_departments();
      departments_list.value = response;
    } catch (error) {
      console.error(error);
    }
  }

  async function get_teams_department(id_dep: number) {
    try {
      const response = await api.get_teams_department(id_dep);
      team_list.value = response;
      // console.log(team_list.value);
    } catch (error) {
      console.error(error);
    }
  }


  return {
    loading: api.loading,
    get_departments,
    get_teams_department,
    departments_list,
    team_list
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDepartment, import.meta.hot))

