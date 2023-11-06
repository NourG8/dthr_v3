<script setup lang="ts">
import { betweenValidator, dateBetweenValidator, dateMax100Validator, dateStatusContractValidator, requiredValidator } from '@/@core/utils/validators';
import { useContract } from "@/stores/contract";
import { useUser } from "@/stores/user";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Swal from 'sweetalert2';

const { get_user_contracts, get_user, get_user_contracts_model, get_user_contracts_signed, affect_contract_user, upload_old_file_contract,
    edit_contract_user, delete_contract } = useUser();
const { contracts_list_user, users_list, signed_contracts_list_user, user } = storeToRefs(useUser());

const { get_contracts, downloadContractUser, downloadModelContract } = useContract();
const { contracts_list } = storeToRefs(useContract());

const route = useRoute();
const tab = ref(0);
const tab_physical_contract = ref(0);
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
    fileContract: null,
    contract_id: "",
    user_id: "",
    placeOfWork: "",
    startTimeWork: "",
    endTimeWork: "",
    trialPeriod: "",
    type: "",
});

const defaultItemC = ref({
    startDate: "",
    raison: "",
    endDate: "",
    salary: "",
    date_status: "",
    status: "",
    fileContract: null,
    contract_id: "",
    user_id: "",
    placeOfWork: "",
    startTimeWork: "",
    endTimeWork: "",
    trialPeriod: "",
    type: "",
});

const startTimeWork = ref('')
const endTimeWork = ref('')
const testModel = ref(1)
const fileContract = ref(null)

onMounted(async () => {
    await get_user(route.params.id);
    //   await get_user_contracts(route.params.id)
    await get_user_contracts_model(route.params.id);
    // console.log(user.value);
    // console.log(contracts_list_user.value);
    await get_contracts()
    // console.log(contracts_list.value)
    await get_user_contracts_signed(route.params.id)
    // console.log(signed_contracts_list_user.value)

});

async function AddContract() {
    add_contract.value = 1;
    editedIndex.value = -1;
    startTimeWork.value = ''
    endTimeWork.value = ''
    fileContract.value = null
    editedItemC.value = Object.assign({}, defaultItemC);
    // await valid_form_contract(editedItemC.value.contract_id)
}

async function closeAddContract() {
    add_contract.value = 0;
    editedItemC.value = Object.assign({}, defaultItemC.value)
}

const check_upload = ref(0)
async function UploadContract() {
    await validateFormPhysicalContract(editedItemC.value.contract_id)
    if (upload_image.value == false) {
        check_upload.value = 0
        upload_image.value = true
    } else {
        upload_image.value = false
    }
}

const options = ref([])
function editContract(item: any) {
    editedIndex.value = 1;
    add_contract.value = 1;
    editedItemC.value = Object.assign({}, item);

    if (editedItemC.value.fileContract !== null) {
        fileContract.value = [new File([], editedItemC.value.fileContract, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })];
    }

    editedItemC.value.raison = null;
    valid_form_contract(item.contract_id);

    convertTimeFormat(editedItemC.value.startTimeWork, startTimeWork);
    convertTimeFormat(editedItemC.value.endTimeWork, endTimeWork);

    if (editedItemC.value.status == 'Draft') {
        options.value = [
            { value: 'Draft', text: 'Draft' },
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Edited', text: 'Edited' },
        ];
    } else if (editedItemC.value.status == 'Edited') {
        options.value = [
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Delivered', text: 'Delivered' },
            { value: 'Edited', text: 'Edited' },
        ];
    } else if (editedItemC.value.status == 'Delivered') {
        options.value = [
            { value: 'Canceled', text: 'Canceled' },
            { value: 'Delivered', text: 'Delivered' },
            { value: 'Signed', text: 'Signed' },
        ];
    } else if (editedItemC.value.status == 'Signed') {
        options.value = [
            { value: 'Signed', text: 'Signed' },
            { value: 'Ended', text: 'Ended' },
        ];
    }
}

function formTitle() {
    return editedIndex.value === -1 ? "Add new contract" : "Edit contract";
}

const verif_Form_Contract = ref(0)
function saveUserContracts(item: any) {
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
                affect_contract_user({ contract: item_contract, user: user.value })
                Swal.fire('contrat added').then(result => {
                    AfficherModelContractUser()
                    add_contract.value = 0
                    editedItemC.value = Object.assign({}, defaultItemC.value)
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

                Swal.fire('contract edited').then(result => {
                    AfficherModelContractUser()
                    add_contract.value = 0
                    editedItemC.value = Object.assign({}, defaultItemC.value)
                })

            }
        })
    }
}

function AfficherModelContractUser() {
    get_user_contracts_model(user.value?.id)
    get_user_contracts_signed(route.params.id)
}

const min_startDate = ref('')
const min_endDate = ref('')
async function valid_form_contract(contract_id: any) {
    await handleContractForm(contract_id)
    await validateFormContract()
}

async function handleContractForm(contract_id: any) {
    await get_contracts()
    contracts_list.value.forEach(contract => {
        if (contract.id == contract_id) {
            if (contract.file == null) {
                testModel.value = 0
            } else {
                testModel.value = 1
            }
        }
    })

    min_startDate.value = user.value?.integrationDate
    min_endDate.value = editedItemC.value.startDate

    for (let k = 0; k < contracts_list.value.length; k++) {
        if (contracts_list.value[k].id == editedItemC.value.contract_id) {
            editedItemC.value.type = contracts_list.value[k].type
        }
    }

    if (editedItemC.value.type === 'CDI') {
        editedItemC.value.endDate = ''
    }
}

function validateFormContract() {
    if (fileContract.value) {
        editedItemC.value.fileContract = fileContract.value[0]
    }
    if (
        editedItemC.value.status === 'Canceled' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.raison) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(editedItemC.value.date_status) === true &&
        dateStatusContractValidator(editedItemC.value.date_status, user.value?.integrationDate) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true) {
        // console.log("cas (Canceled)")
        return true
    } else if (
        editedItemC.value.status === 'Ended' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.raison) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(editedItemC.value.date_status) === true &&
        dateStatusContractValidator(editedItemC.value.date_status, user.value?.integrationDate) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true) {
        // console.log("cas (Ended)")
        return true
    } else if (editedItemC.value.type === 'CDI' &&
        editedItemC.value.status === 'Signed' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(editedItemC.value.date_status) === true &&
        dateStatusContractValidator(editedItemC.value.date_status, user.value?.integrationDate) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true &&
        requiredValidator(editedItemC.value.fileContract) === true) {
        // console.log("cas CDI (signed)")
        return true;
    } else if (editedItemC.value.type === 'CDD' &&
        editedItemC.value.status === 'Signed' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.endDate) === true &&
        dateMax100Validator(editedItemC.value.endDate, editedItemC.value.startDate) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(editedItemC.value.date_status) === true &&
        dateStatusContractValidator(editedItemC.value.date_status, user.value?.integrationDate) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true &&
        requiredValidator(editedItemC.value.fileContract) === true) {
        // console.log("cas CDD (signed)")
        return true
    }
    else if (
        editedItemC.value.status !== 'Signed' &&
        editedItemC.value.status !== 'Canceled' &&
        editedItemC.value.status !== 'Ended' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(editedItemC.value.date_status) === true &&
        dateStatusContractValidator(editedItemC.value.date_status, user.value?.integrationDate) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true) {
        // console.log("cas CDD (unsigned)")
        return true
    } else if (editedItemC.value.type === 'CDD' &&
        !editedItemC.value.status &&
        !editedItemC.value.date_status &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.endDate) === true &&
        dateMax100Validator(editedItemC.value.endDate, editedItemC.value.startDate) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true) {
        console.log("cas CDD (unsigned)")
        return true
    } else if (editedItemC.value.type === 'CDI' &&
        !editedItemC.value.status &&
        !editedItemC.value.date_status &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.placeOfWork) === true &&
        requiredValidator(editedItemC.value.trialPeriod) === true &&
        betweenValidator(editedItemC.value.trialPeriod, 1, 1200) === true &&
        requiredValidator(editedItemC.value.salary) === true &&
        betweenValidator(editedItemC.value.salary, 100, 100000) === true &&
        requiredValidator(startTimeWork.value) === true &&
        requiredValidator(endTimeWork.value) === true) {
        console.log("cas CDI (unsigned)")
        return true;
    } else {
        console.log("cas Error ")
        return false
    }
}

const disabled_upload_contract = ref(false)
async function validateFormPhysicalContract(contract_id: any) {
    await handleContractForm(contract_id)

    if (editedItemC.value.type === 'CDI' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(image.value) === true) {
        // console.log("cas CDI ")
        disabled_upload_contract.value = true
        return true;
    } else if (editedItemC.value.type === 'CDD' &&
        requiredValidator(editedItemC.value.contract_id) === true &&
        requiredValidator(editedItemC.value.startDate) === true &&
        dateBetweenValidator(editedItemC.value.startDate, user.value?.integrationDate) === true &&
        requiredValidator(editedItemC.value.endDate) === true &&
        dateMax100Validator(editedItemC.value.endDate, editedItemC.value.startDate) === true &&
        requiredValidator(image.value) === true) {
        // console.log("cas CDD ")
        disabled_upload_contract.value = true
        return true
    } else {
        disabled_upload_contract.value = false
        return false
    }
}

const select_timepicker = ref(false)
function OpenTimePicker() {
    select_timepicker.value = true
}

function CloseTimePicker() {
    select_timepicker.value = false
}

function setStartTime(time: any) {
    if (time) {
        const formattedTime = `${time.hours}:${time.minutes}`;
        editedItemC.value.startTimeWork = formattedTime;
    }
}

function setEndTime(time: any) {
    if (time) {
        const formattedTime = `${time.hours}:${time.minutes}`;
        editedItemC.value.endTimeWork = formattedTime;
    }
}

function convertTimeFormat(timeString, targetVariable) {
    if (timeString) {
        let [hours, minutes] = timeString.split(':').map(Number);
        targetVariable.value = { 'hours': hours, 'minutes': minutes, seconds: 0 };
    }
}

async function downloadModelContractUser(item: any) {
    if (item.file != null) {
        Swal.fire({
            title: "Are you sure you want to download this contract ?",
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Download',
        }).then(result => {
            if (result.isConfirmed) {
                if (item.fileContract == null) {
                    downloadModelContract({ contract: item, user: user.value })
                } else if (item.fileContract != null) {
                    downloadContractUser(item)
                }
            }
        })
    } else if (item.file == null) {
        Swal.fire({
            icon: 'warning',
            title: "Contract form not available !",
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
        })
        return
    }
}

const interval = ref({})
const valueUpload = ref(0)
const image = ref('')
const image_uploaded = ref(false)
async function SaveContractUploaded() {
    if (valueUpload.value === 100 && check_upload.value === 0) {
        let item_contract = editedItemC.value
        let imageFile = image.value
        Swal.fire({
            title: "Are you sure you want to save this contract ? ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save',
        }).then(result => {
            if (result.isConfirmed) {
                upload_old_file_contract({ file: imageFile, contract: item_contract, id_user: user.value?.id })
                cancelUpload()
                AfficherModelContractUser()
                Swal.fire('Contract added', "", "success")
            }
        })
    }
}

function cancelUpload() {
    check_upload.value = 0
    image_uploaded.value = false
    upload_image.value = false
    image.value = ''
    editedItemC.value = Object.assign({}, defaultItemC.value)
}

async function removeFile() {
    image.value = ''
    clearInterval(interval.value)
    valueUpload.value = 0
    await validateFormPhysicalContract(editedItemC.value.contract_id)
}

function progressCircle(file) {
    interval.value = setInterval(() => {
        if (check_upload.value === 0 && valueUpload.value < 100) {
            valueUpload.value += 10
        }
    }, 100)
}

function onDrop(e) {
    valueUpload.value = 0
    e.stopPropagation()
    e.preventDefault()
    var files = e.dataTransfer.files
    console.log("files : ", files)
    progressCircle(files[0])
    createFile(files[0])
}

function createFile(file) {
    if (file.name.split('.')[1] != 'docx' && file.name.split('.')[1] != 'pdf') {
        Swal.fire({
            icon: 'warning',
            title: 'CreateFile',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
        })
        return
    }
    image.value = file
}

async function onChange(e) {
    valueUpload.value = 0
    var files = e.target.files
    progressCircle(files[0])
    createFile(files[0])
    await validateFormPhysicalContract(editedItemC.value.contract_id)
}

function Downloadcontract(item) {
    Swal.fire({
        title: "Are you sure you want to download this contract ?",
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Download',
    }).then(result => {
        if (result.isConfirmed) {
            downloadContractUser(item)
        }
    })
}

function Deletecontract(item) {
    Swal.fire({
        title: "Are you sure you want to delete this contract ?",
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
    }).then(result => {
        if (result.isConfirmed) {
            delete_contract(item)
            Swal.fire('contract deleted successfully')
            AfficherModelContractUser()
            get_user_contracts_signed(route.params.id)
            tab_physical_contract.value = 0;
        }
    })
}

</script>

<template>
    <v-card>
        <v-tabs background-color="transparent" color="basil" grow class="mb-4" height="60px" v-model="tabs_contract">
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
                                <b class="mr-2"> ( {{ user?.lastName }} {{ user?.firstName }} )</b>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" outlined class="mr-2" @click="AddContract()"
                                    v-if="add_contract == 0">
                                    New Contract
                                </v-btn>
                            </v-card-actions>
                        </div>
                        <v-container v-if="typeof contracts_list_user == 'string'">
                            <v-row class="fill-height" align-content="center" justify="center">
                                <v-col class="text-subtitle-1 text-center" cols="12">
                                    Msg Contract1
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
                                    <v-card flat class="contract-card">
                                        <v-card-text class="contract-info">
                                            <v-card-actions>
                                                <b>Type Contracts : </b> Contracts "{{ item.type }}"
                                            </v-card-actions>

                                            <p class="ml-3">
                                                <b>StartDate : </b>{{ item.startDate }}
                                            </p>
                                            <p class="ml-3" v-if="item.endDate != null && item.endDate != '0000-00-00'">
                                                <b>EndDate : </b> {{ item.endDate }}
                                            </p>
                                            <p class="ml-3" v-if="item.trialPeriod != null">
                                                <b>Trial Period : </b> {{ item.trialPeriod }} Months
                                            </p>

                                            <p class="ml-3" v-if="item.trialPeriod != null">
                                                <b>Status : </b>
                                                <v-chip class="ma-2" color="primary" outlined>
                                                    {{ item.status }}
                                                </v-chip>
                                            </p>
                                            <p>
                                                <v-tooltip bottom v-if="item.file == null">
                                                    <template>
                                                        <v-btn color="primary" v-on="on" rounded depressed
                                                            @click="downloadModelContractUser(item)"
                                                            class="contract-button">
                                                            <v-icon left icon="mdi-cloud-arrow-down">
                                                            </v-icon>
                                                            Contract_{{ item.type }}_{{ user?.lastName }}_{{ user?.firstName
                                                            }}
                                                        </v-btn>
                                                    </template>
                                                    <span>Contract form not available</span>
                                                </v-tooltip>
                                                <v-btn v-if="item.file != null" color="primary" rounded depressed
                                                    @click="downloadModelContractUser(item)" class="contract-button">
                                                    <v-icon left icon="mdi-cloud-arrow-down"> </v-icon>
                                                    <b class="ml-2">
                                                        Contract_{{ item.type }}_{{ user.lastName }}_{{ user.firstName }}
                                                    </b>
                                                </v-btn>
                                                <input ref="uploader" class="d-none" type="file" accept="image/*" />
                                                <v-btn
                                                    v-if="item.status == 'Draft' || item.status == 'Edited' || item.status == 'Delivered' || item.status == 'Signed'"
                                                    color="#ABE188" class="ml-3 pl-7 pr-7 contract-button" rounded depressed
                                                    outlined @click="editContract(item)">
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
                            <span class="v-card__title">Add new contract : </span>

                            <div>
                                <div class="card">
                                    <v-row class="mt-3">
                                        <v-col cols="12" v-if="testModel == 0">
                                            <v-alert dense outlined type="warning">
                                                Le contrat que vous avez sélectionné n'a pas de modèle !
                                            </v-alert>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-3" v-if="editedIndex === -1 ||
                                        (editedIndex === 1 &&
                                            (editedItemC.status === 'Draft' ||
                                                editedItemC.status === 'Edited' ||
                                                editedItemC.status === 'Delivered'))">
                                        <v-col cols="12" md="4">
                                            <v-select v-model="editedItemC.contract_id" :items="contracts_list"
                                                item-title="type" item-value="id" label="TypeContract"
                                                :rules="[requiredValidator]" placeholder="TypeContract"
                                                @update:model-value=" valid_form_contract(editedItemC.contract_id)"></v-select>
                                        </v-col>
                                        <v-col cols="12" :md="`${editedItemC.type == 'CDD' || '' ? 4 : 8}`">
                                            <v-text-field required v-model="editedItemC.startDate" label="StartDat" dense
                                                placeholder="Start date" type="date" outlined
                                                @change="valid_form_contract(editedItemC.contract_id)"
                                                :rules="[requiredValidator, dateBetweenValidator(editedItemC.startDate, user?.integrationDate)]">
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4" v-if="editedItemC.type == 'CDD'">
                                            <v-text-field v-model="editedItemC.endDate" label="EndDate" type="date" outlined
                                                dense placeholder="End date" @keyup="valid_form_contract()"
                                                :rules="[editedItemC.type === 'CDD' ? (requiredValidator, dateMax100Validator(editedItemC.endDate, editedItemC.startDate)) : true]">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row v-if="editedIndex === -1 ||
                                        (editedIndex === 1 &&
                                            (editedItemC.status === 'Draft' ||
                                                editedItemC.status === 'Edited' ||
                                                editedItemC.status === 'Delivered'))">
                                        <v-col cols="12" md="4">
                                            <v-text-field required v-model="editedItemC.placeOfWork" label="PlaceOfWork"
                                                type="text" outlined dense placeholder="PlaceOfWork"
                                                @keyup="valid_form_contract()" :rules="[requiredValidator]">
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="editedItemC.trialPeriod" min="1" max="1200"
                                                @keyup="valid_form_contract()" label="TrialPeriod(mois)" type="number"
                                                outlined dense placeholder="TrialPeriod"
                                                :rules="[requiredValidator, betweenValidator(editedItemC.trialPeriod, 1, 1200)]">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="editedItemC.salary" label="Salary" type="number"
                                                min="100" max="100000" outlined dense placeholder="Salary"
                                                @keyup="valid_form_contract()"
                                                :rules="[requiredValidator, betweenValidator(editedItemC.salary, 100, 100000)]">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row class="mt-3" v-if="editedIndex === 1">
                                        <v-col cols="12" md="6">
                                            <v-select required v-model="editedItemC.status" :items="options" label="Status"
                                                item-title="text" item-value="value" outlined dense placeholder="Status"
                                                :rules="[editedIndex === 1 ? requiredValidator : true]"
                                                @update:model-value="valid_form_contract(editedItemC.contract_id)"
                                                @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field required v-model="editedItemC.date_status" label="date_status"
                                                type="date" outlined dense placeholder="Status date"
                                                :rules="[editedIndex === 1 ? (requiredValidator, dateStatusContractValidator(editedItemC.date_status, user?.integrationDate)) : true]"
                                                @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row v-if="editedIndex === -1 || (editedIndex === 1 && (editedItemC.status === 'Draft' || editedItemC.status === 'Edited' ||
                                        editedItemC.status === 'Delivered'))">
                                        <v-col cols="12" md="6">
                                            <VCard title="Add start time of work"
                                                :height="select_timepicker === true ? 550 : 'auto'">
                                                <VCardText>
                                                    <VForm ref="refVForm" @submit.prevent>
                                                        <VueDatePicker v-model="startTimeWork" time-picker
                                                            :min-time="min_time" :max-time="max_time" class="px-7"
                                                            minutes-increment="1" placeholder="Date rappel"
                                                            :rules="[requiredValidator]" @open="OpenTimePicker"
                                                            @update:model-value="setStartTime(startTimeWork), validateFormContract()"
                                                            @change="setStartTime(startTimeWork), validateFormContract()"
                                                            @closed="CloseTimePicker" />
                                                    </VForm>
                                                </VCardText>
                                            </VCard>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <VCard title="Add end time of work"
                                                :height="select_timepicker === true ? 550 : 'auto'">
                                                <VCardText>
                                                    <VForm ref="refVForm" @submit.prevent>
                                                        <VueDatePicker v-model="endTimeWork" time-picker
                                                            :min-time="min_time" :max-time="max_time" class="px-7"
                                                            minutes-increment="1" placeholder="Date rappel"
                                                            :rules="[requiredValidator]" @open="OpenTimePicker"
                                                            @change="setEndTime(endTimeWork)"
                                                            @update:model-value="setEndTime(endTimeWork), validateFormContract()"
                                                            @closed="CloseTimePicker" />
                                                    </VForm>
                                                </VCardText>
                                            </VCard>
                                        </v-col>
                                    </v-row>

                                    <v-row class="mt-3" v-if="editedIndex === 1">
                                        <v-col cols="12" v-if="editedItemC.status === 'Signed'">
                                            <v-file-input v-model="fileContract" label="ContractSigne" dense outlined
                                                placeholder="ContractSigned"
                                                :rules="[editedItemC.status === 'Signed' ? requiredValidator : true]"
                                                @change="valid_form_contract(editedItemC.contract_id)">
                                            </v-file-input>

                                        </v-col>
                                        <v-col cols="12" v-if="editedItemC.status === 'Canceled' ||
                                            editedItemC.status === 'Ended'
                                            ">
                                            <v-textarea outlined name="input-7-4" v-model="editedItemC.raison" required
                                                :label="`${editedItemC.status === 'Canceled'
                                                    ? 'Canceled raison'
                                                    : 'Ended raison'
                                                    }`" placeholder="Raison" dense
                                                :rules="[editedItemC.status === 'Canceled' || editedItemC.status === 'Ended' ? requiredValidator : true]"
                                                @keyup="valid_form_contract(editedItemC.contract_id)">
                                            </v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-3">
                                        <v-col></v-col>
                                    </v-row>
                                    <v-row class="mt-3">
                                        <v-col></v-col>
                                    </v-row>
                                </div>
                            </div>
                        </v-form>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" outlined type="reset" @click="closeAddContract()"
                                v-if="add_contract == 1">
                                Cancel
                            </v-btn>
                            <v-btn color="primary" @click="saveUserContracts('word')"
                                :disabled="testModel == 0 || validateFormContract() === false" v-if="add_contract == 1 &&
                                    editedItemC.status != 'Signed' &&
                                    add_contract == 1 &&
                                    editedItemC.status != 'Canceled' &&
                                    add_contract == 1 &&
                                    editedItemC.status != 'Ended'">
                                save and download the word
                            </v-btn>
                            <v-btn color="primary" @click="saveUserContracts('pdf')"
                                :disabled="testModel == 0 || validateFormContract() === false" v-if="add_contract == 1 &&
                                    editedItemC.status != 'Signed' &&
                                    editedItemC.status != 'Canceled' &&
                                    editedItemC.status != 'Ended'
                                    ">
                                save and download the PDF
                            </v-btn>
                            <v-btn color="primary" @click="saveUserContracts(null)"
                                :disabled="testModel == 0 || validateFormContract() === false" v-if="add_contract == 1">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <v-window-item>
                <div class="pt-2 mb-1" v-if="upload_image == false">
                    <v-card-actions>
                        List Contracts User
                        <b> ( {{ user?.lastName }} {{ user?.firstName }} )</b>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" outlined @click="UploadContract()" v-if="upload_image == false">
                            Upload Contract
                        </v-btn>
                    </v-card-actions>
                </div>

                <v-form ref="'formContract'" v-if="upload_image == true" class="mt-1 pt-2 pl-5 pr-5">
                    <span class="v-card__title"> Charger Contract</span>

                    <div>
                        <div class="card">
                            <v-row class="mt-3">
                                <v-col cols="12" md="4">
                                    <v-select required @change="validateFormPhysicalContract(editedItemC.contract_id)"
                                        @update:model-value="validateFormPhysicalContract(editedItemC.contract_id)"
                                        v-model="editedItemC.contract_id" :items="contracts_list" item-title="type"
                                        :rules="[requiredValidator]" item-value="id" label="TypeContract" outlined dense
                                        placeholder="TypeContract">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" :md="`${editedItemC.type == 'CDD' || '' ? 4 : 8}`">
                                    <v-text-field required v-model="editedItemC.startDate" :min="`${min_startDate}`"
                                        :max="`${max_startDate}`"
                                        @change="validateFormPhysicalContract(editedItemC.contract_id)" label="StartDate"
                                        :rules="[requiredValidator, dateBetweenValidator(editedItemC.startDate, user?.integrationDate)]"
                                        type="date" outlined dense placeholder="Start date">
                                    </v-text-field>

                                </v-col>
                                <v-col cols="12" md="4" v-if="editedItemC.type == 'CDD'">
                                    <v-text-field v-model="editedItemC.endDate"
                                        @keyup="validateFormPhysicalContract(editedItemC.contract_id)" outlined dense
                                        :rules="[editedItemC.type === 'CDD' ? (requiredValidator, dateMax100Validator(editedItemC.endDate, editedItemC.startDate)) : true]"
                                        :min="`${min_endDate}`" :max="`${max_endDate}`" label="EndDate" type="date"
                                        placeholder="End date">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                        <div class="helper" v-if="upload_image == true"></div>
                        <v-row justify="center" align="center" class="fill-height">
                            <div class="drop display-inline align-center mt-5" @dragover.prevent @drop="onDrop"
                                v-if="upload_image == true">
                                <br />
                                <v-icon v-if="!image" icon="mdi-cloud-upload" size="200" tile class="profile ml-3"></v-icon>
                                <br />
                                <span v-if="!image" style="font-size: 18px;color:#909FB2">Drag and Drop contract
                                    here</span><br />
                                <span v-if="!image" style="font-size: 18px;color:#000000">Or</span>
                                <br v-if="!image" />
                                <div class="helper"></div>

                                <label v-if="!image" class="btn display-inline mb-16 mt-7">
                                    Browse
                                    <input type="file" name="image" @change="onChange"
                                        :rules="[requiredValidator(image)]" />
                                </label>

                                <div class="hidden display-inline align-center" v-else v-bind:class="{ image: true }">
                                    <v-progress-circular :rotate="180" :size="210" :width="5" :model-value="valueUpload"
                                        color="#226289">
                                        <v-avatar v-if="image && image_uploaded == false" class="profile ml-3" size="200">
                                            <img style="width: 161px !important;"
                                                src="@/assets/images/DownloadFile/pdf_docx.png" />
                                        </v-avatar>
                                        <v-avatar v-if="image_uploaded == true" class="profile ml-3" size="200" tile>
                                            <v-icon class="mr-2" color="#0277BD" icon="mdi-check"></v-icon>
                                        </v-avatar>
                                    </v-progress-circular>
                                    <br />
                                    <span v-if="image && image_uploaded == false"> {{ image.name }} </span>
                                    <br /><br />

                                    <button color="#226289" v-if="check_upload === 0 && valueUpload === 100"
                                        class="btn mb-16" @click="removeFile"> REMOVE </button>
                                </div>
                            </div>
                        </v-row>
                        <br /><br />
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" class="mb-1 mr-2" :disabled="disabled_upload_contract === false"
                                @click="SaveContractUploaded">Sauvegarder</v-btn>
                            <v-btn color="primary" outlined class="mb-1 mr-2" @click="cancelUpload()">Annuler</v-btn>
                        </v-card-actions>
                    </div>
                </v-form>

                <div class="d-flex flex-row">
                    <v-tabs v-model="tab_physical_contract" direction="vertical" v-if="upload_image == false">
                        <v-tab v-for="(item, k) in signed_contracts_list_user" :key="k">
                            <v-icon left icon="mdi-book-edit-outline"></v-icon>
                            <span>Contract {{ k + 1 }}</span>
                        </v-tab>
                    </v-tabs>

                    <v-window v-model="tab_physical_contract" v-if="upload_image == false">
                        <v-window-item v-for="(item, c) in signed_contracts_list_user" :key="c">
                            <v-card-actions>
                                <b>TypeContracts : </b>Contracts "{{ item.type }}"
                            </v-card-actions>
                            <p class="ml-3"><b>StartDate : </b>{{ item.startDate }}</p>
                            <p class="ml-3" v-if="item.endDate != null && item.endDate != '0000-00-00'">
                                <b>EndDate &ensp;:</b> {{ item.endDate }}
                            </p>
                            <p>
                                <v-btn color="primary" class="ml-3" rounded depressed @click="Downloadcontract(item)">
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
                </div>
            </v-window-item>
        </v-window>
    </v-card>
</template>

  
<style scoped>
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
.contract-card {
    margin-left: 3px;
}

.contract-info {
    margin-left: 3px;
}

.contract-button {
    margin-left: 3px;
}
</style>
  