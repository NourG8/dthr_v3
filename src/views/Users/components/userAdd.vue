<script setup lang="ts">
import { dateMaxValidator, dateMin18Validator, emailValidator, integerValidator, lengthValidator, requiredValidator, vueTelInputValidator } from '@/@core/utils/validators';
import { useNotyf } from '@/composable/useNotyf';
import { useCompany } from '@/stores/company';
import { useDepartment } from '@/stores/department';
import { usePosition } from '@/stores/position';
import { useUser } from '@/stores/user';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import Draggable from 'vuedraggable';
import { VForm } from 'vuetify/components';

// Store position
const { get_positions } = usePosition()
const { positions_list } = storeToRefs(usePosition())
// Store department
const { get_departments, get_teams_department } = useDepartment()
const { departments_list, team_list } = storeToRefs(useDepartment())
// Store company
const { get_companies } = useCompany()
const { companies_list } = storeToRefs(useCompany())

// Store user
const { get_users, store_user } = useUser()
const { users_list, loading } = storeToRefs(useUser())


onMounted(async () => {
  get_positions()
  // console.log("position : ",positions_list.value)
  get_departments()
  // console.log("department : ",departments_list.value)
  updateTeamList()

  await get_companies()
  await getRegimeSocial()
  // console.log(company.value.max_cin)
  getCinAndPassportArray()

  editedItem.nationality = company.value.nationality
});

const company = ref()
const regimeSocialOptions = ref([]);
const nationality = ref()
async function getRegimeSocial() {
  company.value = JSON.parse(localStorage.getItem('companyData'));
  nationality.value = company.value.nationality;
  regimeSocialOptions.value = JSON.parse(company.value.regimeSocial)
}

function getCinAndPassportArray() {
  if (editedItem.cin) {
    editedItem.cin = String(editedItem.cin)
  }else{
    editedItem.cin = String("")
  }
  if (editedItem.numPassport) {
    editedItem.numPassport = String(editedItem.numPassport)
  }else{
    editedItem.numPassport = String("")
  }
}

const step = ref(1)

const upd = ref(0)
function updateNationality() {
  upd.value = !upd.value
}

const steps = ref([
  { number: 1, name: 'Generale' },
  { number: 2, name: 'Contacts' },
  { number: 3, name: 'Family Situation' },
  { number: 4, name: 'Identity' },
  { number: 5, name: 'Study' },
  { number: 6, name: 'Motivation' },
  { number: 7, name: 'Administrative' },
])

const editedItem = reactive({
  // Les champs de la première étape
  id : '',
  lastName: '',
  firstName: '',
  dateBirth: '',
  placeBirth: '',
  sex: null,

  // Les champs de la deuxième étape
  address: '',
  email: '',
  emailProf: '',
  phone: '',
  phoneEmergency: '',

  // Les champs de la troisieme étape
  familySituation: '',
  nbChildren: '',

  // Les champs de la cinquieme étape
  numPassport: '',
  nationality: '',
  cin: '',
  deliveryDateCin: '',
  deliveryPlaceCin: '',

  specialty: '',
  levelStudies: '',

  //Les champs de la derniere étape
  integrationDate: '',
  matricule: '',
  team: null,
  regimeSocial: null,

  position_id: '',
  department_id: '',
  text : '',
  motivation : ''

});

const enabled = ref(true)

const listDragAndDrop = ref([
  { id: 1, text: 'atmosphère' },
  { id: 2, text: 'professionnalisme' },
  { id: 3, text: 'Reconnaissance' },
  { id: 4, text: 'argent' },
  { id: 5, text: 'environnement de travail' }
])

function checkMove(e) {
  const draggedItem = listDragAndDrop.value[e.draggedContext.index];
  const replacedItem = listDragAndDrop.value[e.draggedContext.futureIndex];
  const tempId = draggedItem.id;
  draggedItem.id = replacedItem.id;
  replacedItem.id = tempId;
  editedItem.motivation = listDragAndDrop.value
  console.log(editedItem.motivation)
}

function isCardIdAndCinRequired() {
  validateNumPassport()
  validateCarteId()
  validateCIN()

  return editedItem.nationality !== nationality.value
}
const department = ref(editedItem.department_id)
const team = ref(editedItem.position_id)

function updateTeamList() {
  if (editedItem.department_id) {
    get_teams_department(editedItem.department_id);
  }
  if (editedItem.department_id === department.value) {
    editedItem.position_id = team.value
  } else {
    editedItem.position_id = null;
  }
}

const isFormValid = ref(false);
const currentStep = ref(0)

watch(() => {
  updateTeamList()
})

function getAvatarColor(index) {
  return index === currentStep.value ? 'primary' : 'secondary';
}

function nextStep() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

const sexOptions = ['Women', 'Man'];
const familySituationOptions = ['Married', 'Divorced', 'Single'];
const isDragging = ref(false)

const departmentOptions = ['Département 1', 'Département 2', 'Département 3']; // Remplace avec tes options réelles
const teamOptions = ['Équipe 1', 'Équipe 2', 'Équipe 3']; // Remplace avec tes options réelles

function validateStep0() {
  console.log((
    requiredValidator(editedItem.lastName) === true &&
    lengthValidator(editedItem.lastName, 15, 3) === true &&
    requiredValidator(editedItem.firstName) === true &&
    lengthValidator(editedItem.firstName, 15, 3) === true &&
    requiredValidator(editedItem.placeBirth) === true &&
    lengthValidator(editedItem.placeBirth, 15, 3) === true &&
    requiredValidator(editedItem.sex) === true &&
    requiredValidator(editedItem.dateBirth) === true &&
    dateMin18Validator(editedItem.dateBirth) === true &&
    dateMaxValidator(editedItem.dateBirth) === true))
  return (
    requiredValidator(editedItem.lastName) === true &&
    lengthValidator(editedItem.lastName, 15, 3) === true &&
    requiredValidator(editedItem.firstName) === true &&
    lengthValidator(editedItem.firstName, 15, 3) === true &&
    requiredValidator(editedItem.placeBirth) === true &&
    lengthValidator(editedItem.placeBirth, 15, 3) === true &&
    requiredValidator(editedItem.sex) === true &&
    requiredValidator(editedItem.dateBirth) === true &&
    dateMin18Validator(editedItem.dateBirth) === true &&
    dateMaxValidator(editedItem.dateBirth) === true)
}

function validateStep1() {
  return (
    requiredValidator(editedItem.address) === true &&
    lengthValidator(editedItem.address, 15, 3) === true &&
    requiredValidator(editedItem.email) === true &&
    emailValidator(editedItem.email) === true &&
    emailValidator(editedItem.emailProf) === true &&
    validationPhoneError.value === '' &&
    validationPhoneEmergencyError.value === ''
  );
}

function validateStep2() {
  return (
    requiredValidator(editedItem.nbChildren) === true &&
    integerValidator(editedItem.nbChildren) === true
  );
}

function validateStep3() {

  if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false  && requiredValidator(editedItem.deliveryDateCin) === true 
  && requiredValidator(editedItem.deliveryPlaceCin) === true && lengthValidator(editedItem.deliveryPlaceCin , 15,3) === true && editedItem.numPassport === ''
) {
    // Cas 1
    console.log("nour cas 1 ")
    return true
  } else if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false && editedItem.numPassport 
  && lengthValidator(editedItem.numPassport,company.value.max_passport,company.value.min_passport) === true) {
    // Cas 1
    console.log("nour cas 2 ")
    return true
  } else if(isCardIdAndCinRequired() === true && requiredValidator(editedItem.carteId) === true && lengthValidator(editedItem.carteId, 50, 3) === true && isValidPassport.value ){
    // Cas 2
     console.log("nour cas 3 ")
    return true
  }else{
    // console.log("nour cas 4 ")
    return false
  }
}

function validateStep4() {
  return (
    requiredValidator(editedItem.specialty) === true &&
    lengthValidator(editedItem.specialty, 15, 4) === true &&
    lengthValidator(editedItem.levelStudies, 15, 4) === true &&
    requiredValidator(editedItem.levelStudies) === true
  );
}

function validateStep6() {
  return (
    requiredValidator(editedItem.integrationDate) === true &&
    requiredValidator(editedItem.department_id) === true  &&
    requiredValidator(editedItem.position_id) === true &&
    requiredValidator(editedItem.regimeSocial) === true  &&
    requiredValidator(editedItem.text) === true
  );
}

const dateMinDeliveryCin = ref(moment());

interface Props {
  data: any;
} 

const props = withDefaults(defineProps<Props>(), {});

const refVForm = ref<VForm>()
const notyf = useNotyf()
function save(){
  console.log(editedItem)
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        if (isValid) {
            props.data = false
                Swal.fire({
                    title: 'Add user',
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonText: 'cancel',
                    confirmButtonText: 'add',
                }).then(async result => {
                    if (result.isConfirmed) {
                      props.data = false
                        await store_user(editedItem).then(res => {
                            get_users()
                            notyf.success('user succes add')
                        })
                    }
                })
        }
    })
}

const phoneNumber = ref('')
const selectedCountry = ref({ valid: false });
const valid = ref(false);

const validationPhoneError = ref('');
const validationPhoneEmergencyError = ref('');

const customPhoneValidation = async (value, country) => {
console.log(editedItem.phone)
console.log(value)
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;

  if (!value) {
    validationPhoneError.value = 'Numéro de téléphone est required !';
  } else if (vueTelInputValidator(country)) {
    validationPhoneError.value = 'Numéro de téléphone invalide !';
  } else {
    validationPhoneError.value = '';
  }
};

const customPhoneEmergencyValidation = async (value, country) => {
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;

  if (!value) {
    validationPhoneEmergencyError.value = 'Numéro de téléphone est required !';
  } else if (vueTelInputValidator(country)) {
    validationPhoneEmergencyError.value = 'Numéro de téléphone invalide !';
  } else {
    validationPhoneEmergencyError.value = '';
  }
};

const logNumPassport = (value) => {
    console.log("Nouvelle valeur de numPassport:", value);
}

const isValidPassport = ref()
const messageValidNumPassport = ref('')
function validateNumPassport() {
  const isNationality = editedItem.nationality === company.value.nationality;

  if (editedItem.numPassport && lengthValidator(editedItem.numPassport,company.value.max_passport,company.value.min_passport) != true){
    // console.log("test 2")
    isValidPassport.value = false
    messageValidNumPassport.value = `Passport number must be between ${company.value.min_passport} and ${company.value.max_passport} characters !`
  }
  else{
    // console.log("test 3")
    isValidPassport.value = true
    messageValidNumPassport.value = ""
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidPassport.value
  };
}

const isValidCarteId = ref()
const messageValidCarteId = ref('')
function validateCarteId() {
  const isNationality = editedItem.nationality === company.value.nationality;
  requiredValidator(editedItem.carteId)

  if(!isNationality && !editedItem.carteId ){
    // console.log("test 1")
    isValidCarteId.value = false
    messageValidCarteId.value = "carte id  is required !"
  }else if (editedItem.carteId && lengthValidator(editedItem.carteId,8,6) != true){
    // console.log("test 2")
    isValidCarteId.value = false
    messageValidCarteId.value = "carte id  must be between 6 and 8 characters !"
  }
  else{
    // console.log("test 3")
    isValidCarteId.value = true
    messageValidCarteId.value = ""
  }

  console.log("Nourrrr :  " , requiredValidator(editedItem.carteId))

  return {
    'otp-input': true,
    'error-tel-input': !isValidCarteId.value
  };
}

const isValidCIN = ref();
const messageValidCIN = ref('');

function validateCIN() {
  const isNationality = editedItem.nationality === company.value.nationality;
  requiredValidator(editedItem.cin);

  if (isNationality && !editedItem.cin) {
    // console.log("cin test 1")
    isValidCIN.value = false;
    messageValidCIN.value = "Le numéro de CIN est obligatoire !";
  } else if (editedItem.cin && lengthValidator(editedItem.cin, 8, 6) !== true) {
    // console.log("cin test 2")
    isValidCIN.value = false;
    messageValidCIN.value = "Le numéro de CIN doit comporter entre 6 et 8 caractères !";
  } else {
    // console.log("cin ntest 3")
    isValidCIN.value = true;
    messageValidCIN.value = "";
  }

  console.log("Validation du CIN : ", requiredValidator(editedItem.cin));

  return {
    'otp-input': true,
    'error-tel-input': !isValidCIN.value
  };
}


</script>

<template>
  <v-row>
    <v-col v-for="(step, index) in steps" :key="index" class="text-center">
      <v-avatar :color="getAvatarColor(index)" class="avatar">
        {{ step.number }}
      </v-avatar>
      <span>{{ step.name }}</span>
    </v-col>
  </v-row>
  <VForm ref="refVForm" @submit.prevent>
  <v-row>
    <v-col>
      <div v-if="currentStep === 0">
        <!-- Contenu de l'étape Generale -->
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.lastName" label="Nom"
              :rules="[requiredValidator, lengthValidator(editedItem.lastName, 15, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.firstName" label="Prénom"
              :rules="[requiredValidator, lengthValidator(editedItem.lastName, 15, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.dateBirth" label="Date de naissance" type="date"
              :rules="[requiredValidator, dateMin18Validator, dateMaxValidator(editedItem.dateBirth)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.placeBirth" label="Lieu de naissance"
              :rules="[requiredValidator, lengthValidator(editedItem.placeBirth, 15, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-select v-model="editedItem.sex" :items="sexOptions" label="Sexe" :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep" :disabled="currentStep === 0">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="currentStep === steps.length - 1 || !validateStep0()">Next</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else-if="currentStep === 1">
        <!-- Contenu de l'étape Contacts -->
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.address" label="Adresse"
              :rules="[requiredValidator, lengthValidator(editedItem.address, 15, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.email" label="Email"
              :rules="[requiredValidator, emailValidator(editedItem.email)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.emailProf" label="Email professionnel"
              :rules="[emailValidator(editedItem.emailProf)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <vue-tel-input v-model:value="editedItem.phone" type="number" mode="international"
              :class="{ 'custom-input': !validationPhoneError, 'error-tel-input': validationPhoneError }"
              :rules="[requiredValidator(editedItem.phone), vueTelInputValidator(selectedCountry)]" @input="customPhoneValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message">{{ validationPhoneError }}</div>
          </v-col>
          <v-col>
            <vue-tel-input :value="editedItem.phoneEmergency" type="number" mode="international"
              :class="{ 'custom-input': !validationPhoneEmergencyError, 'error-tel-input': validationPhoneEmergencyError }"
              :rules="[requiredValidator, vueTelInputValidator(selectedCountry)]" @input="customPhoneEmergencyValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message">{{ validationPhoneEmergencyError }}</div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="currentStep === steps.length - 1 || !validateStep1()">Next</v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 2">
        <!-- Contenu de l'étape Family Situation -->
        <v-row>
          <v-col>
            <v-select v-model="editedItem.FamilySituation" :items="familySituationOptions" label="Situation familiale"
              :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.nbChildren" label="Nombre d'enfants"
              :rules="[requiredValidator, integerValidator(editedItem.nbChildren)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="!validateStep2()">Next</v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 3">
        <!-- Contenu de l'étape Identity -->
        <v-row>
          <v-col cols="12" md="2"  class="mt-4">
            <v-icon start icon="mdi-passport"></v-icon> passport number
          </v-col>
          <v-col cols="12" md="5" class="mt-2">
            <v-otp-input
              ref="otpInput"
              v-model:value="editedItem.numPassport"
              separator="-"
              :input-classes="validateNumPassport()"
              :num-inputs="company.max_passport"
              input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"
            ></v-otp-input>
            <div v-if="!isValidPassport.value" class="error-message v-input__details v-messages__message">
             {{ messageValidNumPassport }}
            </div>
          </v-col>
          <v-col cols="12" md="4" class="mt-2 md:mt-0">
            <v-text-field v-model="editedItem.nationality" @change="isCardIdAndCinRequired" @click="isCardIdAndCinRequired"
              label="Nationalité" :disabled="upd == 0"></v-text-field>
          </v-col>
          <v-col cols="12" md="1" class="mt-2 md:mt-0">
            <v-btn @click="updateNationality" outlined color="rgb(34 167 95)" class="ml-5 mt-2"
              style="min-width: 10px !important">
              <v-icon icon="mdi-pen" color="white"></v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="isCardIdAndCinRequired() === false">
          <v-col cols="12" md="2" class="margin-title">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> CIN
          </v-col>
          <v-col cols="12" md="5">
            <v-otp-input ref="otpInput" v-model:value="editedItem.cin" separator="-"
              :num-inputs="company.max_cin" input-type="numeric"
              :placeholder="['*', '*', '*', '*', '*', '*', '*', '*']"
              :input-classes="validateCIN()" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="date" v-model="editedItem.deliveryDateCin" label="Date de délivrance CIN"
            :rules="[editedItem.cin !== null ? (requiredValidator) : true ]"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="editedItem.deliveryPlaceCin" label="Lieu de délivrance CIN" 
            :rules="[editedItem.cin !== null ? (requiredValidator,lengthValidator(editedItem.deliveryPlaceCin , 15,3)) : true ]" ></v-text-field>
          </v-col>
        </v-row>
        <v-row cols="12" v-if="isCardIdAndCinRequired() === true">  <!-- -->
          <v-col md="2" class="margin-title">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> ID Card
          </v-col>
          <v-col cols="12" md="10">
            <v-text-field v-model="editedItem.carteId" label="Card id" 
              :class="{ 'error-input' : isValidCarteId }"
              :style="{ 'border-color': isValidCarteId ? 'red' : '', 'border-radius': '5px' }"
              :rules="[requiredValidator(editedItem.carteId) , lengthValidator(editedItem.carteId, 50, 3)]"
              @input="validateCarteId()">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="validateStep3() === false">Next</v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 4">
        <!-- Contenu de l'étape Study -->
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.levelStudies" label="Niveau d'études"
            :rules="[requiredValidator, lengthValidator(editedItem.levelStudies, 15, 4)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.specialty" label="Spécialité" 
            :rules="[requiredValidator, lengthValidator(editedItem.specialty, 15, 4)]"></v-text-field>
          </v-col> 
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="!validateStep4() ">Next</v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 5">
        <!-- Contenu de l'étape Motivation -->
        <div class="card-scene">
          <h5 class="my-1">- Please rank the following motivations in order of importance : :</h5>
          <v-row class="my-8" align="center" justify="space-around">
            <Draggable  :list="listDragAndDrop" :disabled="!enabled" item-key="name" class="list-group" ghost-class="ghost"
              :move="checkMove" @start="isDragging = true" @end="isDragging = false">
              <template #item="{ element }">
                <v-btn class="my-2 mx-2 list-group-item" :class="{ 'not-draggable': !enabled }">
                  {{ element.id }} - {{ element.text }}
                </v-btn>
              </template>
            </Draggable>
          </v-row>

          <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" >Next</v-btn>
          </v-col>
        </v-row>
        </div>
      </div>

      <div v-else-if="currentStep === 6">
        <!-- Contenu de l'étape Administrative -->
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="editedItem.integrationDate" label="Date d'intégration"
            :rules="[requiredValidator]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.matricule" label="Matricule"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="editedItem.department_id" :items="departments_list" item-title="departmentName"
              item-value="id" @change="updateTeamList" @click="updateTeamList" label="Département"  :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-select v-model="editedItem.position_id" :items="team_list" item-title="name" item-value="id"
              label="Équipe"  :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="editedItem.regimeSocial" :items="regimeSocialOptions" item-title="regimeSocial"
              item-value="regimeSocial" label="Régime social"  :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.text" label="Autre Régime Social"  :rules="[requiredValidator]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="save()" :disabled="!validateStep6()" >Save</v-btn>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-row>
</VForm>
  <!-- <v-row>
      <v-col>
        <v-btn @click="previousStep" :disabled="currentStep === 0">Previous</v-btn>
      </v-col>
      <v-col class="text-right">
        <v-btn @click="nextStep" :disabled="currentStep === steps.length - 1 || !validateStep0()  || !validateStep1()">Next</v-btn>
      </v-col>
    </v-row> -->
</template>

<style>
.avatar {
  margin: 0 10px;
}

.margin-title {
  margin-top: 12px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.custom-input {
  display: flex;
  height: 56px;
  border-radius: 5px;
}

.otp-input {
  width: 100%;
  height: 55px;
  padding: 3px;
  margin: 0 3px;
  /* font-size: 15px; */
  border-radius: 1px;
  border: 1px solid rgba(145, 145, 145, 0.3);
  text-align: center;
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}

input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}

.error-tel-input {
  border-color: red;
  display: flex;
  height: 56px;
  border-radius: 5px;
}

.error-input {
  border-color: red;
  border-radius: 5px;
}

.error-message {
  color: rgb(var(--v-theme-error));
  line-height: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  transition-duration: 150ms;
  margin-left: 15px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
