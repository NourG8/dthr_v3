<script setup lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue';
import { useNotyf } from '@/composable/useNotyf';
import router from '@/router';
import { useUser } from '@/stores/user';
import userAdd from '@/components/Users/components/userAdd.vue';
import userDetails from '@/components/Users/components/userDetails.vue';
import userEdit from '@/components/Users/components/userEdit.vue';
import Swal from 'sweetalert2';

// Store user
const { get_users, store_user, update_user, archive_user, unarchive_user, delete_user, reset_pwd_user , get_archive_users } = useUser()
const { users_list, users_list_archive, loading } = storeToRefs(useUser())

const notyf = useNotyf()

onMounted(() => {
  get_users()
})

const columns = ref([
  { text: '', value: 'image' },
  { text: 'lastName', value: 'lastName' },
  { text: 'firstName', value: 'firstName' },
  { text: 'email', value: 'email' },
  { text: 'professional email', value: 'emailProf' },
  { text: 'Address', value: 'address' },
  { text: 'phone', value: 'phone' },
  { text: 'matricule', value: 'matricule' }
])

const editedItem = ref<any>({
  id: null,
  lastName: '',
  email: '',
  firstName: '',
  emailProf: '',
  address: '',
  phone: '',
  matricule: '',
  sex: '',
  dateBirth: '',
  placeBirth: '',
  status: '',
  nationality: '',
  phoneEmergency: '',
  familySituation: '',
  nbChildren: null,
  levelStudies: '',
  specialty: '',
  sivp: '',
  carteId: '',
  durationSivp: '',
  cin: '',
  deleveryDateCin: '',
  deleveryPlaceCin: '',
  numPassport: '',
  integrationDate: ''
})

const dialogDetails = ref(false)
const dialogEdit = ref(false)
const dialogAdd = ref(false)

function closeDetails() {
  dialogDetails.value = false
}

function closeUpdate() {
  dialogEdit.value = false
}

function closeAdd() {
  dialogAdd.value = false
}

function detailsUser(item: any) {
  editedItem.value = Object.assign({}, item)
  dialogDetails.value = true
  console.log(editedItem.value)
}

function updateUser(item: any) {
  editedItem.value = Object.assign({}, item)
  dialogEdit.value = true
  console.log(editedItem.value)
}

function AddUser() {
  dialogAdd.value = true
}

// const refVForm = ref<VForm>()
interface Props {
  dataAdd: any;
}

const propsAdd = withDefaults(defineProps<Props>(), {});

function save(item: any) {
  dialogAdd.value = false
  Swal.fire({
    title: 'Add user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'add',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await store_user(item).then(res => {
        console.log(res)
        get_users()
        notyf.success('user succes add')
      })
    }
  })
}

function update(item: any) {
  dialogEdit.value = false
  Swal.fire({
    title: 'Edit user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'update',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await update_user(item).then(res => {
        console.log(res)
        get_users()
        notyf.success('user succes update')
      })
    }
  })
}

function archiveUser(item: any) {
  Swal.fire({
    title: 'Archive user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'archive',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await archive_user(item).then(res => {
        get_users()
        notyf.success('user succes archived')
      })
    }
  })
}

function unarchiveUser(item: any) {
  Swal.fire({
    title: 'Unarchive user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'unarchive',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await unarchive_user(item).then(res => {
        get_users()
        get_archive_users()
        notyf.success('user succes unarchived')
      })
    }
  })
}

function deleteUser(item: any) {
  Swal.fire({
    title: 'Delete user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'delete',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await delete_user(item).then(res => {
        get_users()
        notyf.success('user succes deleted')
      })
    }
  })
}

function resetUser(item: any) {
  Swal.fire({
    title: 'Reset pwd user',
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: 'cancel',
    confirmButtonText: 'reset',
  }).then(async result => {
    if (result.isConfirmed) {
      dialogAdd.value = false
      await reset_pwd_user(item).then(res => {
        get_users()
        notyf.success('user succes reset')
      })
    }
  })
}

const archive = ref(false)
async function list_archive_users() {
  archive.value = true
  await get_archive_users();
  console.log(users_list_archive.value)
}

async function list_users() {
  archive.value = false
  await get_users();
  console.log(users_list.value)
}

async function contractUser(item : any) {
  router.push(`/user/contracts/${item.id}`)
}


</script>

<template>
  <div>
    <v-dialog v-model="dialogDetails" max-width="850px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> DetailsUser ({{ editedItem.lastName }} {{ editedItem.firstName
        }})</v-card-title>
        <v-card-text>
          <userDetails :data="editedItem"></userDetails>
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

    <v-dialog v-model="dialogEdit" max-width="1500px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Update User ({{ editedItem.lastName }} {{ editedItem.firstName
        }})</v-card-title>
        <v-card-text>
          <userEdit :data="editedItem" @update="update"></userEdit>
          <v-row>
            <v-col cols="12">
              <v-card-actions>
                <span></span>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined class="mt-4" type="reset" @click="closeUpdate()">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAdd" max-width="1500px">
      <v-card flat class="pa-3 mt-2">
        <v-card-title class="text-h5 mb-5"> Add User </v-card-title>
        <v-card-text>
          <userAdd @save="save"></userAdd>
          <v-row>
            <v-col cols="12">
              <v-card-actions>
                <span></span>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined class="mt-4" type="reset" @click="closeAdd()">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <VCard min-height="250px" >
    <div class="text-center mt-9" v-if="loading" >
            <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
    </div>

    <DataTable v-else :columns="columns" :rows="archive === true ? users_list_archive : users_list" :with-action="true">
      <template #image="data">
        <v-avatar size="50" class="ma-2">
          <img src="@/assets/images/avatars/profil.png" alt="John" style="width: 100%; height: 100%;" />
        </v-avatar>
      </template>

      <template #is_active="data">
        <div class="text-center">
          <div>
            <VChip class="ma-2" v-if="data.data.is_active === 1" color="#9bd39c">
              <v-icon start icon="mdi-checkbox-marked-circle"></v-icon> Active
            </VChip>
            <VChip class="ma-2" v-else color="error">
              <v-icon start icon="mdi-cancel"></v-icon>Inactive
            </VChip>
          </div>
        </div>
      </template>

      <template #button-data>
        <VMenu>
          <template #activator="{ props }">
            <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-plus-thick" @click="AddUser" v-if="archive === false">
              Add user
            </VBtn>
            <!-- <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-plus"
              @click="AddPartner"  v-if="archive === false">
              Add multiple users
            </VBtn> -->
            <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-remove"
              @click="list_archive_users"  v-if="archive === false">
              Inactive Users List
            </VBtn>
            <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-remove"
              @click="list_users()"  v-if="archive === true">
              Users List
            </VBtn>
          </template>
        </VMenu>
      </template>

      <template #actions="activity">
        <VTooltip :text="'details'" location="bottom">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="detailsUser(activity.data)">
              <VIcon size="24" icon="mdi-account-search" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'edit'" location="bottom" v-if="archive=== false">
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="outlined" color="primary" size="small" @click="updateUser(activity.data)">
              <VIcon size="24" icon="mdi-account-edit" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'archive'" location="bottom" v-if="archive=== false">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="archiveUser(activity.data)">
              <VIcon size="24" icon="mdi-account-cancel" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'unarchive'" location="bottom" v-if="archive=== true">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="unarchiveUser(activity.data)">
              <VIcon size="24" icon="mdi-account-cancel" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'delete'" location="bottom"  v-if="archive=== false">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="deleteUser(activity.data)">
              <VIcon size="24" icon="mdi-account-remove" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'reset'" location="bottom" v-if="archive=== false">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="resetUser(activity.data)">
              <VIcon size="24" icon="mdi-lock-reset" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="'contracts'" location="bottom" v-if="archive=== false">
          <template #activator="{ props }">
            <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
              @click="contractUser(activity.data)">
              <VIcon size="24" icon="mdi-book-edit-outline" />
            </VBtn>
          </template>
        </VTooltip>
      </template>
    </DataTable>
    
    </VCard>
  </div>
</template>
  



