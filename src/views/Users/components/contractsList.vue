<template>
    <v-card>
        <v-tabs background-color="transparent" color="basil" grow class="mb-4" v-model="tabs_contract">
            <v-tab v-for="item in items_contract" :key="item">
                {{ item }}
            </v-tab>
        </v-tabs>

        <v-window v-model="tabs_contract">
            <v-window-item>
                <v-card>
                    <v-card-text>
                        <div class="pt-2 mb-1" v-if="add_contract == 0">
                            <v-card-actions>
                                List Contracts User
                                <b> ( {{ user?.lastName }} {{ user?.firstName }} )</b>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" outlined class="mr-2" @click="AddContract()"
                                    v-if="add_contract == 0">
                                    New Contract
                                </v-btn>
                            </v-card-actions>
                        </div>

                        <!-- <div v-if="contracts_list_user  == null && add_contract == 0">
                            <v-alert dense outlined type="warning" class="ml-5 mr-5">
                            MsgContract
                            </v-alert>
                        </div> -->
                        <v-container v-if="typeof contracts_list_user == 'string'">
                            <v-row class="fill-height" align-content="center" justify="center">
                                <v-col class="text-subtitle-1 text-center" cols="12">
                                    Msg Contract1
                                    <!-- Loading {{ user.lastName }}'s contracts -->
                                </v-col>
                                <v-col cols="6">
                                    <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-container>
                        <div class="d-flex flex-row">
                            <v-tabs v-model="tab" direction="vertical" v-if="add_contract === 0">
                                <v-tab v-for="(item, c) in contracts_list_user" :key="c">
                                    <v-icon left icon="mdi-book-edit-outline"></v-icon>
                                    <span class="ml-1"> Contract {{ c + 1 }}</span>
                                </v-tab>
                            </v-tabs>

                            <v-window v-model="tab" v-if="add_contract === 0">
                                <v-window-item v-for="(item, c) in contracts_list_user" :key="c">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-card-actions>
                                                <b>Type Contracts : </b>Contracts "{{ item.type }}"
                                            </v-card-actions>

                                            <p class="ml-3">
                                                <b>StartDate : </b>{{ item.startDate }}
                                            </p>
                                            <p class="ml-3" v-if="item.endDate != null && item.endDate != '0000-00-00'
                                                ">
                                                <b>EndDate &ensp;:</b> {{ item.endDate }}
                                            </p>
                                            <p class="ml-3" v-if="item.trialPeriod != null">
                                                <b>TrialPeriod :</b> {{ item.trialPeriod }}Months
                                            </p>

                                            <p class="ml-3" v-if="item.trialPeriod != null">
                                                <b>Status :</b>
                                                <v-chip class="ma-2" color="primary" outlined>
                                                    <span v-if="item.status == 'Signed'"> Signé</span>
                                                    <span v-if="item.status == 'Draft'"> Brouillon</span>
                                                    <span v-if="item.status == 'Edited'"> Edité</span>
                                                    <span v-if="item.status == 'Delivered'"> Livré</span>
                                                    <span v-if="item.status == 'Canceled'"> Annulé</span>
                                                    <span v-if="item.status == 'Ended'"> Terminé</span>
                                                </v-chip>
                                                <!-- <v-chip class="ma-2" color="primary" outlined v-if="getLocale == 'en'">
                                                    {{ item.status }}
                                                </v-chip> -->
                                            </p>
                                            <p>
                                                <v-tooltip bottom v-if="item.file == null">
                                                    <template>
                                                        <v-btn color="primary" v-on="on" rounded depressed
                                                            @click="downloadModelContractUser(item)">
                                                            <v-icon left icon="mdi-cloud-arrow-down">
                                                            </v-icon>
                                                            Contract_{{ item.type }}_{{ user?.lastName }}_{{
                                                                user?.firstName
                                                            }}
                                                        </v-btn>
                                                    </template>
                                                    <span>Contract form not available</span>
                                                </v-tooltip>
                                                <v-btn v-if="item.file != null" color="primary" rounded depressed
                                                    @click="downloadModelContractUser(item)">
                                                    <v-icon left icon="mdi-cloud-arrow-down"> </v-icon>
                                                    <b class="ml-2">
                                                        Contract_{{ item.type }}_{{ user.lastName }}_{{
                                                            user.firstName
                                                        }}</b>
                                                </v-btn>
                                                <input ref="uploader" class="d-none" type="file" accept="image/*" />
                                                <v-btn v-if="item.status == 'Draft' ||
                                                        item.status == 'Edited' ||
                                                        item.status == 'Delivered' ||
                                                        item.status == 'Signed'
                                                        " color="#00695C" class="ml-5" rounded depressed outlined
                                                    @click="editContract(item)">
                                                    <v-icon left icon="mdi-pencil "> </v-icon>
                                                    Edit
                                                </v-btn>
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>
                        </div>
                        <v-form v-if="add_contract == 1" class="mt-3 pt-2 pl-5 pr-5">
                            <span class="v-card__title">Add contract</span>

                            <div>
                                <div class="card">
                                    <v-row class="mt-3" v-if="editedIndex === -1 ||
                                        (editedIndex === 1 &&
                                            (editedItemC.status === 'Draft' ||
                                                editedItemC.status === 'Edited' ||
                                                editedItemC.status === 'Delivered'))
                                        ">
                                        <v-col cols="12" v-if="testModel == 0">
                                            <v-alert dense outlined type="warning">
                                                Le contrat que vous avez sélectionné n'a pas de modèle !
                                            </v-alert>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <!-- @change="valid_form_contract(editedItemC.contract_id)" -->
                                            <v-select  v-model="editedItemC.contract_id" :items="contracts_list"
                                                outlined dense item-title="type" item-value="id" label="TypeContract"
                                                placeholder="TypeContract" @input="valid_form_contract(editedItemC.contract_id)" 
                                                @change="valid_form_contract(editedItemC.contract_id)" 
                                               ></v-select>

                                        </v-col>
                                        <v-col cols="12" :md="`${editedItemC.type == 'CDD' || '' ? 4 : 8}`">
                                            <!-- @change="valid_form_contract()"
                                            :min="`${min_startDate}`" :max="`${max_startDate}`" -->
                                            <v-text-field required v-model="editedItemC.startDate" label="StartDat" dense placeholder="Start date"
                                                type="date" outlined @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4" v-if="editedItemC.type == 'CDD'">
                                            <!-- @keyup="valid_form_contract()"
                                                    :min="`${min_endDate}`" :max="`${max_endDate}`" -->
                                            <v-text-field v-model="editedItemC.endDate" label="EndDate" type="date" outlined
                                                dense placeholder="End date" @keyup="valid_form_contract()">
                                            </v-text-field>

                                        </v-col>
                                    </v-row>

                                    <v-row v-if="editedIndex === -1 ||
                                        (editedIndex === 1 &&
                                            (editedItemC.status === 'Draft' ||
                                                editedItemC.status === 'Edited' ||
                                                editedItemC.status === 'Delivered'))
                                        ">
                                        <v-col cols="12" md="8">
                                            <!-- @keyup="valid_form_contract()"  -->
                                            <v-text-field required v-model="editedItemC.placeOfWork" label="PlaceOfWork"
                                                type="text" outlined dense placeholder="PlaceOfWork" @keyup="valid_form_contract()" >
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <!-- @keyup="valid_form_contract()" -->
                                            <v-text-field v-model="editedItemC.trialPeriod" min="1" max="1200" @keyup="valid_form_contract()" 
                                                label="TrialPerio" type="number" outlined dense placeholder="TrialPeriod">
                                            </v-text-field>

                                        </v-col>
                                    </v-row>

                                    <v-row v-if="editedIndex === -1 ||
                                        (editedIndex === 1 &&
                                            (editedItemC.status === 'Draft' ||
                                                editedItemC.status === 'Edited' ||
                                                editedItemC.status === 'Delivered'))
                                        ">
                                        <v-col cols="12" md="4">

                                            <!-- @keyup="valid_form_contract()" -->
                                            <v-text-field required v-model="editedItemC.salary" label="Salary" type="number"
                                                outlined dense placeholder="Salary" @keyup="valid_form_contract()" >
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <!-- @keyup="valid_form_contract()"  -->
                                            <v-text-field required v-model="editedItemC.startTimeWork" label="StartTimeWork"
                                                type="text" outlined dense placeholder="StartTimeWork"
                                                @keyup="valid_form_contract()">
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <!-- @keyup="valid_form_contract()" -->
                                            <v-text-field required v-model="editedItemC.endTimeWork" label="EndTimeWork"
                                                type="text" outlined dense placeholder="EndTimeWork"
                                                @keyup="valid_form_contract()">
                                            </v-text-field>

                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-3" v-if="editedIndex === 1">
                                        <v-col cols="12" md="6">
                                            <!-- @change="valid_form_contract(editedItemC.contract_id)" -->
                                            <v-select required v-model="editedItemC.status" :items="options" label="Status"
                                                item-title="text" item-value="value" outlined dense placeholder="Status"
                                                @change="valid_form_contract(editedItemC.contract_id)"></v-select>

                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <!-- @change="valid_form_contract()" -->
                                            <v-text-field required v-model="editedItemC.date_status" label="date_status"
                                                type="date" outlined dense placeholder="Status date"
                                                @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-text-field>

                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-3" v-if="editedIndex === 1">
                                        <v-col cols="12" v-if="editedItemC.status === 'Signed'">
                                            <!-- @change="valid_form_contract(editedItemC.contract_id)" -->
                                            <v-file-input v-model="editedItemC.fileContract" required label="ContractSigne"
                                                dense outlined placeholder="ContractSigned"
                                                @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-file-input>

                                        </v-col>
                                        <v-col cols="12" v-if="editedItemC.status === 'Canceled' ||
                                            editedItemC.status === 'Ended'
                                            ">
                                            <!-- @keyup="valid_form_contract(editedItemC.contract_id)" -->
                                            <v-textarea outlined name="input-7-4" v-model="editedItemC.raison" required
                                                :label="`${editedItemC.status === 'Canceled'
                                                    ? 'Canceled raison'
                                                    : 'Ended raison'
                                                    }`" placeholder="Raison" dense
                                                @keyup="valid_form_contract(editedItemC.contract_id)">
                                            </v-textarea>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </v-form>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" outlined type="reset" @click="PreviewsContracts()"
                                v-if="add_contract == 1">
                                Cancel
                            </v-btn>
                            <!--   :disabled="verif_Form_Contract == 0 || testModel == 0" -->
                            <v-btn color="primary" @click="saveUserContracts('word')" v-if="add_contract == 1 &&
                                editedItemC.status != 'Signed' &&
                                add_contract == 1 &&
                                editedItemC.status != 'Canceled' &&
                                add_contract == 1 &&
                                editedItemC.status != 'Ended'"
                               >
                                save and download the word
                            </v-btn>
                             <!-- :disabled="verif_Form_Contract == 0 || testModel == 0" -->
                            <v-btn color="primary" @click="saveUserContracts('pdf')"
                                v-if="add_contract == 1 &&
                                    editedItemC.status != 'Signed' &&
                                    add_contract == 1 &&
                                    editedItemC.status != 'Canceled' &&
                                    add_contract == 1 &&
                                    editedItemC.status != 'Ended'
                                    ">
                                save and download the PDF
                            </v-btn>
                            <v-btn color="primary" @click="saveUserContracts(null)"
                                :disabled="verif_Form_Contract == 0 || testModel == 0" v-if="add_contract == 1">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <v-window-item>
                <div class="pt-2 mb-1" v-if="upload_image == false">
                    <v-card-actions>
                        ListContractsUser
                        <b> ( {{ user.lastName }} {{ user.firstName }} )</b>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" outlined @click="UploadContract()" v-if="upload_image == false">
                            Upload Contract
                        </v-btn>
                    </v-card-actions>
                </div>
                <div v-if="itemsContractsSigned == null && upload_image == false">
                    <v-alert dense outlined type="warning" class="ml-5 mr-5">
                        MsgContract
                    </v-alert>
                </div>
                <!-- <v-form ref="'formContract'" v-if="upload_image == true" class="mt-1 pt-2 pl-5 pr-5">
              <span class="v-card__title">  ChargerContract</span>
        
                <div>
                  <div class="card">
                    <v-row class="mt-3">
                      <v-col cols="12" md="4">
                        <ValidationProvider name="Type contract" rules="required">
                          <v-select
                            required
                            @change="valid_form_contract(editedItemC.contract_id)"
                            v-model="editedItemC.contract_id"
                            :items="itemsContrat"
                           :label="$t('Users.TypeContract')"
                            outlined
                            dense
                            :placeholder="$t('Users.TypeContract')"
                          ></v-select>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" :md="`${editedItemC.type == 'CDD' || '' ? 4 : 8}`">
                        <ValidationProvider
                          name="Start date"
                          :rules="`required|date_format:yyyy-MM-dd|date_between:${min_startDate},${max_startDate}`"
                        >
                          <v-text-field
                            required
                            v-model="editedItemC.startDate"
                           :min="`${min_startDate}`"
                            :max="`${max_startDate}`"
                            @change="valid_form_contract()"
                            :label="$t('Users.StartDate')"
                            type="date"
                            outlined
                            dense
                            placeholder="Start date"
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" md="4" v-if="editedItemC.type == 'CDD'">
                        <ValidationProvider
                          name="End date"
                          :rules="`date_format:yyyy-MM-dd|date_between:${min_endDate},${max_endDate}`"
                        >
                          <v-text-field
                            v-model="editedItemC.endDate"
                            @keyup="valid_form_contract()"
                            :min="`${min_endDate}`"
                            :max="`${max_endDate}`"
                           :label="$t('Users.EndDate')"
                            type="date"
                            outlined
                            dense
                            placeholder="End date"
                          >
                          </v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </div>
                  <div class="helper" v-if="upload_image == true"></div>
                  <div
                    class="drop display-inline align-center ml-15"
                    @dragover.prevent
                    @drop="onDrop"
                    v-if="upload_image == true"
                  >
                    <br />
                    <v-avatar v-if="!image" class="profile ml-3" size="200" tile>
                      <v-icon color="#909FB2" v-if="!image">
                        {{ icons.mdiCloudUpload }}
                      </v-icon> </v-avatar
                    ><br />
                    <span v-if="!image" style="font-size: 18px;color:#909FB2">Drag and Drop contract here</span><br />
                    <span v-if="!image" style="font-size: 18px;color:#000000">Or</span>
                    <br v-if="!image" />
                    <div class="helper"></div>

                    <label v-if="!image" class="btn display-inline mb-16 mt-7">
                      {{$t('Contract.Browse')}}
                      <input type="file" name="image" @change="onChange" />
                    </label>

                    <div class="hidden display-inline align-center" v-else v-bind:class="{ image: true }">
                      <v-progress-circular :rotate="360" :size="210" :width="5" :value="value" color="#226289">
                        <v-img
                          v-if="image && image_uploaded == false"
                          style="width: 161px !important;"
                          src="@/assets/images/DownloadFile/pdf_docx.png"
                        ></v-img>
                        <v-avatar v-if="image_uploaded == true" class="profile ml-3" size="200" tile>
                          <v-icon class="mr-2" color="#0277BD">
                            {{ icons.mdiCheck }}
                          </v-icon>
                        </v-avatar> </v-progress-circular
                      ><br />
                      <span v-if="image && image_uploaded == false"> {{ image.name }} </span>
                      <br />
                      <br />
                      <button
                        color="#226289"
                        v-if="check_upload === 0 && value === 100"
                        class="btn mb-16"
                        @click="removeFile"
                      >
                   {{   $t('Contract.REMOVE')}}
                      </button>
                    </div>
                  </div>
                  <br /><br />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      outlined
                      class="mb-1 mr-2"
                      :disabled="!image || invalid || !validated || value != 100"
                      @click="SaveContractUploaded"
                      > {{   $t('Users.Save')}}</v-btn
                    >
                    <v-btn color="primary" outlined class="mb-1 mr-2" @click="CancelUpload()">Cancel</v-btn>
                  </v-card-actions>
                </div>
            
            </v-form> -->
                <v-tabs vertical v-if="upload_image == false">
                    <v-tab v-for="(item, k) in itemsContractsSigned" :key="k">
                        <v-icon left icon="mdi-book-edit-outline"></v-icon>
                        <span>Contract {{ k + 1 }}</span>
                    </v-tab>
                </v-tabs>

                <v-window v-model="tab">
                    <v-window-item v-for="(item, c) in contracts_list_user" :key="c">
                        <v-card-actions>
                            <span><b>TypeContracts : </b>Contracts "{{ item.type }}"</span>
                        </v-card-actions>
                        <p class="ml-5"><b>StartDate : </b>{{ item.startDate }}</p>
                        <p class="ml-5" v-if="item.endDate != null && item.endDate != '0000-00-00'">
                            <b>EndDate &ensp;:</b> {{ item.endDate }}
                        </p>
                        <p>
                            <v-btn color="primary" class="ml-5" rounded depressed @click="Downloadcontract(item)">
                                <v-icon left icon="mdi-cloud-arrow-down"> </v-icon>
                                Contract_{{ item.type }}_{{ user.lastName }}_{{
                                    user.firstName
                                }}
                            </v-btn>
                            <input ref="uploader" class="d-none" type="file" accept="image/*" />
                            <v-btn color="error" class="ml-5" outlined rounded depressed @click="Deletecontract(item)">
                                <v-icon left icon="mdi-delete-forever"> </v-icon>
                                Delete
                            </v-btn>
                        </p>
                    </v-window-item>
                </v-window>
            </v-window-item>
        </v-window>
    </v-card>
</template>
  
<script setup lang="ts">
import { useUser } from "@/stores/user";
import { useContract } from "@/stores/contract";
import Swal from 'sweetalert2';

const {
    get_user_contracts,
    get_user,
    get_user_contracts_model,
    get_user_contracts_signed,
    affect_contract_user,
    edit_contract_user } = useUser();
const { contracts_list_user, users_list, signed_contracts_list_user, user } = storeToRefs(useUser());

const { get_contracts } = useContract();
const { contracts_list } = storeToRefs(useContract());

const route = useRoute();
const tab = ref(0);
const add_contract = ref(0);

const items_contract = ref(["Contract", "Physical contract"]);
const tabs_contract = ref(null);
const items_contracts_signed = ref(null);
const editedIndex = ref(-1);
const upload_image = ref(false);

const editedItemC = ref({
    startDate: "",
    raison: "",
    endDate: "",
    salary: "",
    date_status: "",
    status: "",
    fileContract: "",
    contract_id: "",
    user_id: "",
    placeOfWork: "",
    startTimeWork: "",
    endTimeWork: "",
    trialPeriod: "",
    type: "",
});

const testModel = ref(1)

onMounted(async () => {
    await get_user(route.params.id);
    //   await get_user_contracts(route.params.id)
    await get_user_contracts_model(route.params.id);
    console.log(user.value);
    console.log(contracts_list_user.value);
    await get_contracts()
    // console.log(contracts_list.value)
});

async function AfficherSignedContractUser() {
    await get_user_contracts_signed(user.value?.id).then((response) => {
        console.log(response);
        if (response.length == 0) {
            items_contracts_signed.value = null;
        } else {
            items_contracts_signed.value = response; //les contrats de chaque
            add_contract.value = 0;
        }
    });
}

function AddContract() {
    add_contract.value = 1;
    editedIndex.value = -1;
}

function formTitle() {
    return editedIndex.value === -1 ? "Add new contract" : "Edit contract";
}

const verif_Form_Contract = ref(0)
function saveUserContracts(item: any) {
    console.log(item)
    editedItemC.value.download = item
    editedItemC.value.user_id = user.value?.id
    let item_contract = editedItemC.value
    if (editedIndex.value == -1) {
        Swal.fire({
            title: 'Are u sure u want to save this contract ?',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'save',
            cancelButtonText: 'Cancel',
        }).then(result => {
            if (result.isConfirmed) {
                affect_contract_user({ contract: item_contract, user: user.value }).then(response => {
                    verif_Form_Contract.value = 0
                })
                Swal.fire('contrat added' + ' !', '', 'success').then(result => {
                    AfficherModelContractUser()
                    add_contract.value = 0
                })
            }
        })
    }
    else if (editedIndex.value == 1) {
        Swal.fire({
            title: 'Are u sure u want to eit this contract',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Edit',
            cancelButtonText: 'Cancel',
        }).then(result => {
            if (result.isConfirmed) {
                edit_contract_user({ contract: item_contract, user: user.value }).then(response => {
                    verif_Form_Contract.value = 0
                })
                Swal.fire('contract edited' + ' !', '', 'success').then(result => {
                    AfficherModelContractUser()
                    add_contract.value = 0
                })
            }
        })
    }
}

const options = ref([])

function editContract(item: any) {
    editedIndex.value = 1
    add_contract.value = 1
    editedItemC.value = Object.assign({}, item)
    editedItemC.value.fileContract = null
    editedItemC.value.raison = null
    valid_form_contract(item.contract_id)

    if (editedItemC.value.status == 'Draft') {
        options.value = [
            { value: 'Draft', text: 'Draft' },
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Edited', text: 'Edited' },
        ]
    }
    if (editedItemC.value.status == 'Edited') {
        options.value = [
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Delivered', text: 'Delivered' },
            { value: 'Edited', text: 'Edited' },
        ]
    }

    if (editedItemC.value.status == 'Delivered') {
        options.value = [
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Delivered', text: 'Delivered' },
            { value: 'Signed', text: 'Signed' },
        ]
    }
    if (editedItemC.value.status == 'Signed') {
        options.value = [
            { value: 'Signed', text: 'Signed' },
            { value: 'Ended', text: 'Ended' }
        ]
    }
    console.log(options.value)
}

function AfficherModelContractUser() {
    get_user_contracts_model(user.value?.id)
}

const min_startDate = ref('')
const min_endDate = ref('')
async function valid_form_contract(contract_id: any) {
    console.log(contract_id)
    console.log("hallouma ", contracts_list.value)
   await contracts_list.value.forEach(contract => {
        if (contract.id == contract_id) {
           
            if (contract.file == null) {
                console.log("halouma 1 ")
                testModel.value = 0
            } else {
                console.log("halouma 2 ")
                testModel.value = 1
            }
        }
    })
    min_startDate.value = user.value?.integrationDate
    min_endDate.value = editedItemC.value.startDate
    // console.log("ahalimaaa : ",contracts_list.value.length)
    for (let k = 0; k < contracts_list.value.length; k++) {
        console.log(contracts_list.value[k])
        if (contracts_list.value[k].id == editedItemC.value.contract_id) {
            editedItemC.value.type = contracts_list.value[k].type
        }
    }
    if (
        editedItemC.value.type == 'CDD' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.endDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.fileContract != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.status != 'Signed' &&
        editedItemC.value.status != 'Canceled' &&
        editedItemC.value.status != 'Ended'
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.type == 'CDI' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.status != 'Signed' &&
        editedItemC.value.status != 'Canceled' &&
        editedItemC.value.status != 'Ended'
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Signed' &&
        editedItemC.value.type == 'CDD' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.endDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.fileContract != '' &&
        editedItemC.value.trialPeriod != '' &&
        // editedItemC.value.fileContract != null &&
        editedItemC.value.fileContract != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Signed' &&
        editedItemC.value.type == 'CDI' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.fileContract != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Canceled' &&
        editedItemC.value.type == 'CDD' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.endDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.raison != '' &&
        editedItemC.value.raison != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Canceled' &&
        editedItemC.value.type == 'CDI' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.raison != '' &&
        editedItemC.value.raison != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Ended' &&
        editedItemC.value.type == 'CDD' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.endDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.raison != '' &&
        editedItemC.value.raison != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else if (
        editedItemC.value.status === 'Ended' &&
        editedItemC.value.type == 'CDI' &&
        editedItemC.value.startDate != '' &&
        editedItemC.value.salary != '' &&
        editedItemC.value.startTimeWork != '' &&
        editedItemC.value.endTimeWork != '' &&
        editedItemC.value.placeOfWork != '' &&
        editedItemC.value.trialPeriod != '' &&
        editedItemC.value.raison != '' &&
        editedItemC.value.raison != null &&
        editedItemC.value.date_status != null &&
        editedItemC.value.date_status != ''
    ) {
        verif_Form_Contract.value = 1
    } else {
        verif_Form_Contract.value = 0
    }
}

// function PreviewsContracts() {
//   add_contract.value = 0
//   this.$nextTick(() => {
//     this.editedItemC = Object.assign({}, this.defaultItemC)
//     let self = this
//     // Shows the mapRef object reference
//     // self.$refs['formContract'].reset() // returns undefined ???
//   })
// },

const text = ref(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
);
const model = ref("tab-2");
</script>
  
<style scoped>
.content {
    display: flex !important;
    justify-content: center !important;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}

.list-group-item {
    cursor: move;
}

.list-group-item i {
    cursor: pointer;
}

.swal2-styled.swal2-confirm {
    background-color: #3085d6;
}

.swal2-styled.swal2-confirm:focus {
    box-shadow: 0 0 0 3px #8ab7ea !important;
}

.v-avatar .img,
.v-avatar svg,
.v-avatar .v-icon,
.v-avatar .v-image,
.v-avatar .v-responsive__content {
    padding: 20px !important;
}

.btn {
    background-color: #0078fe;
    border: 0;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-weight: bold;
    padding: 15px 35px;
    position: relative;
}

.btn:hover {
    background-color: #3d7797;
}

input[type="file"] {
    position: absolute;
    opacity: 0;
    z-index: -1;
}

.align-center {
    text-align: center;
}

.helper {
    height: 100%;
    display: inline-block;
    vertical-align: middle;
    width: 0;
}

.hidden {
    display: none !important;
}

.hidden.image {
    display: inline-block !important;
}

.display-inline {
    display: inline-block;
    vertical-align: middle;
}

.img {
    border: 1px solid #f6f6f6;
    display: inline-block;
    height: auto;
    max-height: 80%;
    max-width: 80%;
    width: auto;
}

.drop {
    background-color: #e4ebf0;
    border: 4px dashed;
    background-color: #e4ebf0;
    border-radius: 2px;
    height: 100%;
    max-height: 400px;
    max-width: 800px;
    width: 100%;
}
</style>
  