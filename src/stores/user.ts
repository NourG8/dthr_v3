import { useUserApi } from '@/composable/useUserApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const api = useUserApi()

  const users_list = ref<any>([])
  const users_list_archive = ref<any>([])
  const contracts_list_user = ref<any>([])
  const signed_contracts_list_user = ref<any>([])
  const list_user_count = ref()
  const user = ref(null)

  async function get_users() {
    try {
      const response = await api.get_users();

      const usersWithTeamId = response.map(user => {
        const teamId = user.team_user.length > 0 ? user.team_user[0].team_id : null;
        return { ...user, team_id: teamId };
      });
      users_list.value = usersWithTeamId;
    } catch (error) {
      console.error(error);
    }
  }

  async function get_user(id: any) {
    try {
      const response = await api.get_users();
      users_list.value = response;

      const index = users_list.value.findIndex((c) => c.id == id);
      if (index > -1) {
        user.value = users_list.value[index]
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function get_archive_users() {
    const teamId = ref()
    const response = await api.get_archive_user();

    const usersWithTeamId = response.map(user => {
      if (user.team_user) {
        teamId.value = user.team_user.length > 0 ? user.team_user[0].team_id : null;
      }
      return { ...user, team_id: teamId };
    });

    users_list_archive.value = usersWithTeamId;
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
    try {
      const response = await api.store_user(payload)
      users_list.value.push(payload)
    } catch (error) {
      console.log(error)
    }
  }

  async function archive_user(payload: any) {
    const response = await api.archive_user(payload)
    const index = users_list.value.indexOf(payload)
    users_list.value.splice(index, 1)
  }

  async function unarchive_user(payload: any) {
    const response = await api.unarchive_user(payload)
    const index = users_list.value.indexOf(payload)
    users_list.value.splice(index, 1)
  }


  async function reset_pwd_user(payload: any) {
    const response = await api.reset_pwd_user(payload)
    const index = users_list.value.indexOf(payload)
    users_list.value.splice(index, 1)
  }

  async function get_user_contracts(user_id: any) {
    try {
      const response = await api.get_user_contracts(user_id);
      contracts_list_user.value = response.contract;
    } catch (error) {
      console.error(error);
    }
  }

  async function get_user_contracts_model(user_id: any) {
    try {
      const response = await api.get_user_contracts_model(user_id);
      contracts_list_user.value = response;
    } catch (error) {
      console.error(error);
    }
  }

  async function get_user_contracts_signed(user_id: any) {
    try {
      const response = await api.get_user_contracts_signed(user_id);
      signed_contracts_list_user.value = response;
    } catch (error) {
      console.error(error);
    }
  }

  async function affect_contract_user(payload: any) {
    const response = await api.affect_contract_user(payload);
    console.log(response)
    signed_contracts_list_user.value = response;
  }

  async function edit_contract_user(payload: any) {
    const response = await api.edit_contract_user(payload);
    signed_contracts_list_user.value = response;
  }

  return {
    loading: api.loading,
    store_user,
    update_user,
    delete_user,
    archive_user,
    unarchive_user,
    reset_pwd_user,
    get_users,
    get_user,
    get_archive_users,
    get_user_contracts,
    get_user_contracts_model,
    get_user_contracts_signed,
    signed_contracts_list_user,
    affect_contract_user,
    edit_contract_user,
    list_user_count,
    users_list,
    users_list_archive,
    contracts_list_user,
    user
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))

