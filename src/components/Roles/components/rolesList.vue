<script setup lang="ts">

import roleDetails from '@/components/Roles/components/roleDetails.vue';
import { useNotyf } from '@/composable/useNotyf';
import { useRole } from '@/stores/role';
import Swal from 'sweetalert2';

// Store role
const { get_roles ,get_archived_roles , store_role , update_role, delete_role , archive_role , reset_role,  archive_role_with_permissions, get_nb_personnes , get_nb_positions , get_permissions_role } = useRole()
const { roles_list , roles_list_archived , nb_personnes , nb_positions , nb_permissions , permissions_list , loading } = storeToRefs(useRole())

const notyf = useNotyf()

onMounted(() => {
  get_roles()
  // console.log(roles_list.value)
})

const columns = ref([
  { text: '', value: ' ' },
  { text: 'role name', value: 'role' },
  { text: 'description', value: 'description' },
])

const editedIndex= ref(-1)

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
}

function closeDetails() {
  dialogDetails.value = false
}

const dialogAdd = ref(false)
function AddRole() {
  dialogAdd.value = true
}

const dialogEdit = ref(false)
function editRole(item : any )  {
      editedIndex.value = roles_list.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialogEdit.value = true
}

function closeAdd() {
  dialogAdd.value = false
}

function save(item: any) {
  dialogAdd.value = false
  Swal.fire({
    title: 'Add role',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'add',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await store_role(item).then(res => {
        get_roles()
        notyf.success('role succes add')
      })
    }
  })
}

function edit(item: any) {
  dialogEdit.value = false
  Swal.fire({
    title: 'Edit role',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'edit',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogEdit.value = false
      await update_role(item).then(res => {
        get_roles()
        notyf.success('role succes edited !')
      })
    }
  })
}

function closeEdit() {
  dialogEdit.value = false
}

const nbPer = ref(null)
const nbPos = ref(null)
async function archiveRole(item: any) {
      nbPer.value = null
      nbPos.value = null

      await get_nb_positions(item)
      nbPos.value = nb_positions.value

      await get_nb_personnes(item)
      nbPer.value = nb_personnes.value
      // console.log(nbPer.value);
      // console.log(nbPos.value);
      //archiver
      if (nbPos.value == 0 && nbPer.value == 0) {
        Swal.fire({
          title: "Archive role ?",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText: "Archive",
          cancelButtonText: "Cancel",
        }).then(result => {
          if (result.isConfirmed) {
            archive_role(item)
            Swal.fire( 'role succes archived !')
          }
        })
      }
      //archiver
      else if (nbPos.value == 0 && nbPer.value != 0) {
        Swal.fire({
          title: "Archive role with permisions ?",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText: "Archive",
          cancelButtonText: 'Cancel',
        }).then(result => {
          if (result.isConfirmed) {
            archive_role_with_permissions(item)
            Swal.fire( 'role and permissions succes archived !')
          }
        })
      } else if (nbPos.value != 0 && nbPer.value == 0) {
        Swal.fire({
          title:"you cannot archive this role",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        })
      } else if (nbPos.value != 0 && nbPer.value != 0) {
        Swal.fire({
          title:"you cannot archive this role",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        })
      }
}

async function deleteRole(item: any) {
      nbPer.value = null
      nbPos.value = null

      await get_nb_positions(item)
      nbPos.value = nb_positions.value

      await get_nb_personnes(item)
      nbPer.value = nb_personnes.value
     
      //archiver
      if (nbPos.value == 0 && nbPer.value == 0) {
        Swal.fire({
          title: "Delete role ?",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        }).then(result => {
          if (result.isConfirmed) {
            delete_role(item)
            Swal.fire( 'role succes deleted !')
          }
        })
      }
      //archiver
      else if (nbPos.value == 0 && nbPer.value != 0) {
        Swal.fire({
          title: "Delete role with permisions ?",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: 'Cancel',
        }).then(result => {
          if (result.isConfirmed) {
            delete_role(item)
            Swal.fire( 'role and permissions succes deleted !')
          }
        })
      } else if (nbPos.value != 0 && nbPer.value == 0) {
        Swal.fire({
          title:"you cannot delete this role",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        })
      } else if (nbPos.value != 0 && nbPer.value != 0) {
        Swal.fire({
          title:"you cannot delete this role",
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        })
      }
}

const archive = ref(false)
async function list_archive_roles() {
  console.log("archived list !")
  archive.value = true
  await get_archived_roles();
  // console.log(roles_list_archived.value)
}

async function list_roles() {
  archive.value = false
  await get_roles();
  // console.log(roles_list.value)
}

async function reset_role_with_permissions(item :any) {
      await get_permissions_role(item)
      // console.log("permissions : ",permissions_list.value)

      if (permissions_list.value.length != 0) {
        let list = []
        let i = 0
        permissions_list.value.forEach(element => {
          list.push(element)
          i++;
        })
        Swal.fire({
          title:'Reset role ? \n',
          cancelButtonColor: '#d33',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText:'Reset',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
              reset_role_with_permissions(item)
              get_archived_roles()
              Swal.fire('Reset role with permissions sucess !')
          }
        })
      } else {
        Swal.fire({
          title:'Reset role ? \n',
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText:'Reset',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            reset_role(item)
            get_archived_roles()
            Swal.fire('Reset role sucess !')
          }
        })
      }
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

    <v-dialog v-model="dialogAdd" max-width="1000px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Add role </v-card-title>
        <v-card-text>
          <roleAdd @save="save" @close="closeAdd"></roleAdd>
          <v-row>
            <v-col cols="12">
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="1000px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5">Edit role</v-card-title>
        <v-card-text>
          <roleEdit :data="editedItem" @edit="edit" @close="closeEdit"></roleEdit>
          <v-row>
            <v-col cols="12">
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <VCard min-height="250px" >

    <div class="text-center mt-9" v-if="loading" >
            <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
    </div>

    <DataTable v-else :columns="columns" :rows="archive === true ? roles_list_archived : roles_list" :with-action="true">

    <template #role="data" >
        <div class="role-column">{{ data.data.role }}</div>
    </template>

    <template #button-data>
      <VMenu>
        <template #activator="{ props }">
          <!-- v-if="archive === false" -->
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-plus-thick" @click="AddRole">
            Add role
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-playlist-remove"
            @click="list_archive_roles"  v-if="archive === false">
            Inactive roles List
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-details"
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
      <VTooltip :text="'edit'" location="bottom" v-if="archive=== false" >
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="outlined" color="primary" size="small" @click="editRole(activity.data)">
            <VIcon size="24" icon="mdi-account-edit" />
          </VBtn>
        </template>
      </VTooltip>
      <!-- <VTooltip :text="'permissions'" location="bottom">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="contractRole(activity.data)">
            <VIcon size="24" icon="mdi-account-key" />
          </VBtn>
        </template>
      </VTooltip> -->
      <VTooltip :text="'archive'" location="bottom" v-if="archive=== false">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="archiveRole(activity.data)">
            <VIcon size="24" icon="mdi-account-cancel" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'unarchive'" location="bottom" v-if="archive=== true">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="reset_role_with_permissions(activity.data)">
            <VIcon size="24" icon="mdi-account-reactivate" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'delete'" location="bottom" v-if="archive=== false" >
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="deleteRole(activity.data)">
            <VIcon size="24" icon="mdi-account-remove" />
          </VBtn>
        </template>
      </VTooltip>
     
    </template>
  </DataTable>
</VCard>
</template>


<style scoped>
.role-column{
   text-align: center; 
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  
    height: 100%;
}
</style>
