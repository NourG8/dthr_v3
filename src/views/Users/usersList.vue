<script setup lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue';
import { useCompany } from '@/stores/company';
import { useUser } from '@/stores/user';
import userDetails from '@/views/Users/components/userDetails.vue';
import userEdit from '@/views/Users/components/userEdit.vue';
// const notyf = useNotyf()

// Store user
const { get_users } = useUser()
const { users_list, loading } = storeToRefs(useUser())

// Store company
const { get_companies } = useCompany()
const { companies_list } = storeToRefs(useCompany())

onMounted(() => {
    get_users()
})

const columns = ref([
    {text:'',value:'image'},
    { text: '#ID', value: 'id' },
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


function detailsUser(item : any){
    editedItem.value = Object.assign({}, item)
    dialogDetails.value = true 
    console.log(editedItem.value)
}

function updateUser(item : any){
    editedItem.value = Object.assign({}, item)
    dialogEdit.value = true 
    console.log(editedItem.value)
}

function AddUser(){
    dialogAdd.value = true 
}

</script>


<template>
    <div>
        <v-dialog v-model="dialogDetails" max-width="850px">
            <v-card flat class="pa-3 mt-2">
              <v-card-title class="text-h5 mb-5"> DetailsUser ({{ editedItem.lastName }} {{ editedItem.firstName }})</v-card-title>
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
              <v-card-title class="text-h5 mb-5"> Update User ({{ editedItem.lastName }} {{ editedItem.firstName }})</v-card-title>
              <v-card-text>
                <userEdit :data="editedItem"></userEdit>
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
                <userEdit></userEdit>
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

        <DataTable :columns="columns" :rows="users_list" :with-action="true">
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
                    <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-plus-thick" @click="AddUser">
                        Add user
                    </VBtn>
                    <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-plus" @click="AddPartner">
                        Add multiple users
                    </VBtn>
                    <VBtn class="ml-2 text-capitalize" color="primary" prepend-icon="mdi-account-multiple-remove" @click="AddPartner">
                        Inactive Users List
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
            <VTooltip :text="'edit'" location="bottom">
                <template #activator="{ props }">
                    <VBtn v-bind="props" variant="outlined" color="primary" size="small" @click="updateUser(activity.data)">
                        <VIcon size="24" icon="mdi-account-edit" />
                    </VBtn>
                </template>
            </VTooltip>
            <VTooltip :text="'archive'" location="bottom">
                <template #activator="{ props }">
                    <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
                        @click="archiveUser(activity.data)">
                        <VIcon size="24" icon="mdi-account-cancel" />
                    </VBtn>
                </template>
                </VTooltip>
            <VTooltip :text="'delete'" location="bottom">
                <template #activator="{ props }">
                    <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
                        @click="deleteUser(activity.data)">
                        <VIcon size="24" icon="mdi-account-remove" />
                    </VBtn>
                </template>
            </VTooltip>
            <VTooltip :text="'reset'" location="bottom">
                <template #activator="{ props }">
                    <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
                        @click="resetUser(activity.data)">
                        <VIcon size="24" icon="mdi-lock-reset" />
                    </VBtn>
                </template>
            </VTooltip>
            <VTooltip :text="'contracts'" location="bottom">
                <template #activator="{ props }">
                    <VBtn v-bind="props" class="mr-1" variant="outlined" color="primary" size="small"
                        @click="contractUser(activity.data)">
                        <VIcon size="24" icon="mdi-book-edit-outline" />
                    </VBtn>
                </template>
            </VTooltip>
        </template>
    </DataTable>
    </div>
  </template>
  



