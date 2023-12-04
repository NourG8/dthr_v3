import { useUserApi } from '@/composable/useUserApi'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const api = useUserApi()

  const users_list = ref<any>([])
  const users_list_archive = ref<any>([])
  const contracts_list_user = ref<any>([])
  const signed_contracts_list_user = ref<any>([])
  const list_user_count = ref()
  const check_email = ref()
  const check_email_prof = ref()
  const check_phone = ref()
  const check_phone_emergency = ref()
  const check_cin = ref()
  const check_passport = ref()
  const user = ref(null)

  async function get_users() {
    try {
      const response = await api.get_users();

      const usersWithTeamId = response.map(user => {
        const teamId = user.teams.length > 0 ? user.teams[0].team_id : null;
        const departmentId = user.teams.length > 0 ? user.teams[0].team.department_id : null;
        const positionId = user.positions.length > 0 ? user.positions[0].position.id : null;

        return { ...user, team_id: teamId, department_id: departmentId, position_id: positionId, };
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

  async function check_user_email(payload: any) {
    try {
      const response = await api.check_user_email(payload);
      check_email.value = response;

    } catch (error) {
      console.error(error);
    }
  }

  async function check_user_email_prof(payload: any) {
    try {
      const response = await api.check_user_email_prof(payload);
      check_email_prof.value = response;

    } catch (error) {
      console.error(error);
    }
  }

  async function check_user_phone(payload: any) {
    try {
      const response = await api.check_user_phone(payload);
      check_phone.value = response;

    } catch (error) {
      console.error(error);
    }
  }

  async function check_user_phone_emergency(payload: any) {
    try {
      const response = await api.check_user_phone_emergency(payload);
      check_phone_emergency.value = response;

    } catch (error) {
      console.error(error);
    }
  }

  async function check_user_cin(payload: any) {
    try {
      const response = await api.check_user_cin(payload);
      check_cin.value = response;

    } catch (error) {
      console.error(error);
    }
  }

  async function check_user_passport(payload: any) {
    try {
      const response = await api.check_user_passport(payload);
      check_passport.value = response;

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
    signed_contracts_list_user.value = response;
  }

  async function upload_old_file_contract(payload: any) {
    const response = await api.upload_old_file_contract(payload);
    signed_contracts_list_user.value = response;
  }

  async function edit_contract_user(payload: any) {
    const response = await api.edit_contract_user(payload);
    signed_contracts_list_user.value = response;
  }

  async function delete_contract(payload: any) {
    const response = await api.delete_contract(payload);

    const index = signed_contracts_list_user.value.indexOf(payload)
    signed_contracts_list_user.value.splice(index, 1)
    // console.log(signed_contracts_list_user.value)
    // console.log("response : ", response)
  }

  return {
    loading: api.loading,
    store_user,
    update_user,
    check_email,
    check_email_prof,
    check_phone,
    check_phone_emergency,
    check_cin,
    check_passport,
    check_user_passport,
    check_user_cin,
    check_user_phone,
    check_user_email_prof,
    check_user_phone_emergency,
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
    check_user_email,
    signed_contracts_list_user,
    affect_contract_user,
    upload_old_file_contract,
    edit_contract_user,
    delete_contract,
    list_user_count,
    users_list,
    users_list_archive,
    contracts_list_user,
    user
  } as const
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))

