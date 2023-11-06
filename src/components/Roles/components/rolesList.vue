<script setup lang="ts">

import { useNotyf } from '@/composable/useNotyf';
import { useRole } from '@/stores/role';
import roleDetails from '@/components/Roles/components/roleDetails.vue';
// Store role
const { get_roles } = useRole()
const { roles_list } = storeToRefs(useRole())

const notyf = useNotyf()

onMounted(() => {
  get_roles()
  console.log(roles_list.value)
})

const columns = ref([
  { text: '', value: ' ' },
  { text: 'role name', value: 'role' },
  { text: 'description', value: 'description' },
])

const editedItem = ref<any>({
  id: null,
  role: '',
  description: '',
  status: ''
})

const dialogDetails = ref(false)
function detailsRole(item: any) {
  editedItem.value = Object.assign({}, item)
  dialogDetails.value = true
  console.log(editedItem.value)
}

function closeDetails() {
  dialogDetails.value = false
}

</script>

<template>

    <v-dialog v-model="dialogDetails" max-width="850px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Details Roles</v-card-title>
        <v-card-text>
          <roleDetails :data="editedItem"></roleDetails>
          <v-row>
            <v-col cols="12">
              <v-card-actions>
                <span></span>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined class="mt-4" type="reset" @click="closeDetails()">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DataTable :columns="columns" :rows="archive === true ? roles_list_archive : roles_list" :with-action="true">

    <template #role="data" >
        <div class="role-column">{{ data.data.role }}</div>
    </template>

    <template #button-data>
      <VMenu>
        <template #activator="{ props }">
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-plus-thick" @click="AddUser" v-if="archive === false">
            Add user
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-plus"
            @click="AddPartner"  v-if="archive === false">
            Add multiple roles
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-remove"
            @click="list_archive_roles"  v-if="archive === false">
            Inactive roles List
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-remove"
            @click="list_roles()"  v-if="archive === true">
            roles List
          </VBtn>
        </template>
      </VMenu>
    </template>

    <template #actions="activity">
      <VTooltip :text="'details'" location="bottom">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="detailsRole(activity.data)">
            <VIcon size="24" icon="mdi-account-search" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'edit'" location="bottom" >
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="outlined" color="primary" size="small" @click="updateUser(activity.data)">
            <VIcon size="24" icon="mdi-account-edit" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'permissions'" location="bottom">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="contractUser(activity.data)">
            <VIcon size="24" icon="mdi-account-key" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'archive'" location="bottom" >
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="archiveUser(activity.data)">
            <VIcon size="24" icon="mdi-account-cancel" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'delete'" location="bottom"  >
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="deleteUser(activity.data)">
            <VIcon size="24" icon="mdi-account-remove" />
          </VBtn>
        </template>
      </VTooltip>
     
    </template>
  </DataTable>
</template>


<style scoped>
.role-column{
   text-align: center; 
}
</style>
