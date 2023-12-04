<script setup lang="ts">

import { useNotyf } from '@/composable/useNotyf';
import { usePermission } from '@/stores/permission';
import Swal from 'sweetalert2';
// Store permission
const { get_permissions ,get_archived_permissions , store_permission , update_permission, delete_permission , archive_permission , reset_permission} = usePermission()
const { permissions_list , permissions_list_archived  , loading } = storeToRefs(usePermission())

const notyf = useNotyf()

onMounted(() => {
  get_permissions()
  // console.log(permissions_list.value)
})

const columns = ref([
  { text: '', value: ' ' },
  { text: 'permission name', value: 'name' },
  { text: 'guard_name', value: 'guard_name' },
])

const editedIndex= ref(-1)

const editedItem = ref<any>({
  id: null,
  name: '',
  guard_name: '',
  code: ''
})

const dialogDetails = ref(false)
function detailsPermission(item: any) {
  editedItem.value = Object.assign({}, item)
  dialogDetails.value = true
}

function closeDetails() {
  dialogDetails.value = false
}

const dialogAdd = ref(false)
function AddPermission() {
  dialogAdd.value = true
}

const dialogEdit = ref(false)
function editPermission(item : any )  {
      editedIndex.value = permissions_list.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialogEdit.value = true
}

function closeAdd() {
  dialogAdd.value = false
}

function save(item: any) {
  dialogAdd.value = false
  Swal.fire({
    title: 'Add permission',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'add',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await store_permission(item).then(res => {
        get_permissions()
        notyf.success('permission succes add')
      })
    }
  })
}

function edit(item: any) {
  dialogEdit.value = false
  Swal.fire({
    title: 'Edit permission',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'edit',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogEdit.value = false
      await update_permission(item).then(res => {
        get_permissions()
        notyf.success('permission succes edited !')
      })
    }
  })
}

function closeEdit() {
  dialogEdit.value = false
}

// async function archivePermission(item: any) {
//     Swal.fire({
//         title:
//           "Are you sure you want to archive permission" +
//           ' ' +
//           item.name.split('.')[0] +
//           '(' +
//           item.name.split('.')[1] +
//           ')' +
//           ' ' +
//           '?',
//         showCancelButton: true,
//         cancelButtonColor: '#d33',
//         confirmButtonColor: '#3085d6',
//         confirmButtonText: 'Archive',
//         cancelButtonText: 'Cancel',
//       }).then(result => {
//         if (result.isConfirmed) {
//           archive_permission(item)
//           Swal.fire('Archived successfully!')
//         }
//       })
// }

async function deletePermission(item: any) {
    Swal.fire({
        title:
          "Are you sure you want to delete permission" +
          ' ' +
          item.name.split('.')[0] +
          ' ' +
          '?',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then(result => {
        if (result.isConfirmed) {
          delete_permission(item)
          Swal.fire('Deleted successfully!')
        }
      })
}

const archive = ref(false)
async function list_archive_permissions() {
  archive.value = true
  await get_archived_permissions();
  // console.log(permissions_list_archived.value)
}

async function list_permissions() {
  archive.value = false
  await get_permissions();
}

async function resetPermission(item :any) {
        Swal.fire({
          title:'Reset permission ? \n',
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          confirmButtonText:'Reset',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            reset_permission(item)
            get_archived_permissions()
            Swal.fire('Reset permission sucess !')
          }
        })
  }


</script>

<template>
   <!-- <v-dialog v-model="dialogDetails" max-width="850px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Details permissions</v-card-title>
        <v-card-text>
          <permissionDetails :data="editedItem"></permissionDetails>
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
    </v-dialog> -->

     <v-dialog v-model="dialogAdd" max-width="1000px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Add permission </v-card-title>
        <v-card-text>
          <permissionAdd @save="save" @close="closeAdd"></permissionAdd>
          <v-row>
            <v-col cols="12">
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="1000px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5">Edit permission</v-card-title>
        <v-card-text>
          <permissionEdit :data="editedItem" @edit="edit" @close="closeEdit"></permissionEdit>
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

    <DataTable v-else :columns="columns" :rows="archive === true ? permissions_list_archived : permissions_list" :with-action="true">

    <template #permission="data" >
        <div class="permission-column">{{ data.data.permission }}</div>
    </template>

    <template #button-data>
      <VMenu>
        <template #activator="{ props }">
          <!-- v-if="archive === false" -->
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-plus-thick" @click="AddPermission">
            Add permission
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-playlist-remove"
            @click="list_archive_permissions"  v-if="archive === false">
            Inactive permissions List
          </VBtn>
          <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-details"
            @click="list_permissions()"  v-if="archive === true">
            permissions List
          </VBtn>
        </template>
      </VMenu>
    </template>

    <template #actions="activity">
      <!-- <VTooltip :text="'details'" location="bottom">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="detailsPermission(activity.data)">
            <VIcon size="24" icon="mdi-account-search" />
          </VBtn>
        </template>
      </VTooltip> -->
      <VTooltip :text="'edit'" location="bottom" v-if="archive=== false" >
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="outlined" color="primary" size="small" @click="editPermission(activity.data)">
            <VIcon size="24" icon="mdi-account-edit" />
          </VBtn>
        </template>
      </VTooltip>
      <!-- <VTooltip :text="'archive'" location="bottom" v-if="archive=== false">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="archivePermission(activity.data)">
            <VIcon size="24" icon="mdi-account-cancel" />
          </VBtn>
        </template>
      </VTooltip> -->
      <VTooltip :text="'unarchive'" location="bottom" v-if="archive=== true">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="resetPermission(activity.data)">
            <VIcon size="24" icon="mdi-account-reactivate" />
          </VBtn>
        </template>
      </VTooltip>
      <VTooltip :text="'delete'" location="bottom" v-if="archive=== false" >
        <template #activator="{ props }">
          <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
            @click="deletePermission(activity.data)">
            <VIcon size="24" icon="mdi-account-remove" />
          </VBtn>
        </template>
      </VTooltip>
     
    </template>
  </DataTable>
</VCard>
</template>


<style scoped>
.permission-column{
   text-align: center; 
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  
    height: 100%;
}
</style>
