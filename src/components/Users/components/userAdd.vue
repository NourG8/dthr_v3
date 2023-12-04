<script setup lang="ts">
import { checkCin, checkEmail, checkEmailProf, checkPassport, dateIntegrationValidator, dateMin18Max100Validator, dateMinNowMax100Validator, emailValidator, integerValidator, lengthValidator, requiredValidator, vueTelInputValidator } from '@/@core/utils/validators';
import { useCompany } from '@/stores/company';
import { useDepartment } from '@/stores/department';
import { usePosition } from '@/stores/position';
import { useUser } from '@/stores/user';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import Draggable from 'vuedraggable';

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
const { get_users, store_user , check_user_email , check_user_phone_emergency, check_user_phone , check_user_passport , check_user_cin } = useUser()
const { users_list, check_email , check_phone ,check_cin ,check_passport , check_phone_emergency, loading } = storeToRefs(useUser())

const editedItem = reactive({
  // Les champs de la première étape
  id : '',
  last_name: '',
  first_name: '',
  date_birth: '',
  place_birth: '',
  sex: null,
  // Les champs de la deuxième étape
  address: '',
  email: '',
  email_prof: '',
  phone: '',
  phone_emergency: '',
  // Les champs de la troisieme étape
  family_situation: '',
  nb_children: '',
  // Les champs de la cinquieme étape
  num_passport: '',
  nationality: '',
  cin: '',
  carte_id:'',
  delivery_date_cin: '',
  delivery_place_cin: '',

  specialty: '',
  level_studies: '',
  //Les champs de la derniere étape
  integration_date: '',
  registration: '',
  team: null,
  regime_social: null,

  team_id: '',
  department_id: '',
  text : '',
  motivation : '',

  position_id : null
});

const emit = defineEmits(['save'])
const emitSave = () => {
  // Vous émettez l'événement 'save'
  //editedItem parametre de l'evenement save
  emit('save', editedItem);
};

onMounted(async () => {
  get_positions()
  // console.log("position : ",positions_list.value)
  get_departments()
  // console.log("department : ",departments_list.value)

  await get_companies()
  await getRegimeSocial()
  // console.log(company.value.max_cin)
  getCinAndPassportArray()
  await updateTeamList()

  editedItem.nationality = company.value.nationality
  editedItem.motivation = listDragAndDrop.value
});

const company = ref()
const regimeSocialOptions = ref([]);
const nationality = ref()
async function getRegimeSocial() {
  company.value = JSON.parse(localStorage.getItem('companyData'));
  nationality.value = company.value.nationality;
  regimeSocialOptions.value = JSON.parse(company.value.regime_social)
}

function getCinAndPassportArray() {
  if (editedItem.cin) {
    editedItem.cin = String(editedItem.cin)
  }else{
    editedItem.cin = String("")
  }
  if (editedItem.num_passport) {
    editedItem.num_passport = String(editedItem.num_passport)
  }else{
    editedItem.num_passport = String("")
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

const enabled = ref(true)

const listDragAndDrop = ref([
  { id: 1, text: 'atmosphère' },
  { id: 2, text: 'professionnalisme' },
  { id: 3, text: 'Reconnaissance' },
  { id: 4, text: 'argent' },
  { id: 5, text: 'environnement de travail' }
])

function checkMove(e){
  const draggedItem = listDragAndDrop.value[e.draggedContext.index];
  const replacedItem = listDragAndDrop.value[e.draggedContext.futureIndex];
  const tempId = draggedItem.id;
  draggedItem.id = replacedItem.id;
  replacedItem.id = tempId;
  editedItem.motivation = listDragAndDrop.value
  // console.log(editedItem.motivation)
}

function isCardIdAndCinRequired() {
  validateNumPassport()
  validatecarte_id()
  validateCIN()

  if(editedItem.nationality !== nationality.value){
   editedItem.cin = ''
   editedItem.delivery_date_cin = ''
   editedItem.delivery_place_cin = ''
  }else{
    editedItem.carte_id = ''
  }

  return editedItem.nationality !== nationality.value
}
const department = ref(editedItem.department_id)
const team = ref(editedItem.team_id)

function updateTeamList() {
  if (editedItem.department_id) {
    get_teams_department(editedItem.department_id);
  }
  if (editedItem.department_id === department.value) {
    editedItem.team_id = team.value
  } else {
    editedItem.team_id = null;
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

const sexOptions = ['Female', 'Male'];
const family_situationOptions = [ 'Single','Married', 'Divorce', 'Widow'];
const isDragging = ref(false)

const departmentOptions = ['Département 1', 'Département 2', 'Département 3']; // Remplace avec tes options réelles
const teamOptions = ['Équipe 1', 'Équipe 2', 'Équipe 3']; // Remplace avec tes options réelles

function validateStep0() {
  return (
    requiredValidator(editedItem.last_name) === true &&
    lengthValidator(editedItem.last_name, 30, 3) === true &&
    requiredValidator(editedItem.first_name) === true &&
    lengthValidator(editedItem.first_name, 30, 3) === true &&
    requiredValidator(editedItem.place_birth) === true &&
    lengthValidator(editedItem.place_birth, 30, 3) === true &&
    requiredValidator(editedItem.sex) === true &&
    requiredValidator(editedItem.date_birth) === true &&
    dateMin18Max100Validator(editedItem.date_birth) === true)
}

function validateStep1() {
  return (
    requiredValidator(editedItem.address) === true &&
    lengthValidator(editedItem.address, 30, 3) === true &&
    requiredValidator(editedItem.email) === true &&
    emailValidator(editedItem.email) === true &&
    emailValidator(editedItem.email_prof) === true &&
    // checkEmail(editedItem.email ) !==  'email exist' &&
    // checkEmailProf(editedItem.email_prof ) !==  'email exist' &&
    editedItem.phone != ''&& editedItem.phone_emergency &&
    validationPhoneError.value === 'valid' &&
    validationphoneEmergencyError.value === 'valid'
  );
}

function validateStep2() {
  return (
    requiredValidator(editedItem.nb_children) === true &&
    integerValidator(editedItem.nb_children) === true
  );
}

function validateStep3() {
  if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false  && requiredValidator(editedItem.delivery_date_cin) === true 
  && dateMinNowMax100Validator(editedItem.delivery_date_cin) === true && requiredValidator(editedItem.delivery_place_cin) === true 
  && lengthValidator(editedItem.delivery_place_cin , 30,3) === true && editedItem.num_passport === ''
) {
    // Cas 1
    console.log("step 3 cas 1 ")
    return true
  } else if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false && validateNumPassport()['error-tel-input'] === false && editedItem.num_passport 
  && requiredValidator(editedItem.delivery_date_cin) === true && dateMinNowMax100Validator(editedItem.delivery_date_cin) === true  
  && requiredValidator(editedItem.delivery_place_cin) === true  && lengthValidator(editedItem.delivery_place_cin , 30,3) === true
  && lengthValidator(editedItem.num_passport,company.value.max_passport,company.value.min_passport) === true) {
    // Cas 2
    console.log("step 3 cas 2 ")
    return true
  } else if(isCardIdAndCinRequired() === true && requiredValidator(editedItem.carte_id) === true && lengthValidator(editedItem.carte_id, 50, 3) === true && isValidPassport.value ){
    // Cas 3
     console.log("step 3 cas 3 ")
    return true
  }else{
    return false
  }
}

function validateStep4() {
  return (
    requiredValidator(editedItem.specialty) === true &&
    lengthValidator(editedItem.specialty, 30, 4) === true &&
    lengthValidator(editedItem.level_studies, 30, 4) === true &&
    requiredValidator(editedItem.level_studies) === true
  );
}

function validateStep6() {
  if( requiredValidator(editedItem.integration_date) === true &&
    dateIntegrationValidator(editedItem.integration_date , editedItem.date_birth) === true &&
    requiredValidator(editedItem.department_id) === true  &&
    requiredValidator(editedItem.team_id) === true &&
    requiredValidator(editedItem.position_id) === true  &&
    requiredValidator(editedItem.regime_social) === true && 
    requiredValidator(editedItem.registration) === true && 
    lengthValidator(editedItem.registration, 30, 3) === true &&
    editedItem.text !=null && lengthValidator(editedItem.text, 30, 4) === true ){
       return true
    }else if( requiredValidator(editedItem.integration_date) === true &&
    dateIntegrationValidator(editedItem.integration_date , editedItem.date_birth) === true &&
    requiredValidator(editedItem.department_id) === true  &&
    requiredValidator(editedItem.team_id) === true &&
    requiredValidator(editedItem.position_id) === true  &&
    requiredValidator(editedItem.registration) === true && 
    lengthValidator(editedItem.registration, 30, 3) === true &&
    requiredValidator(editedItem.regime_social) === true && editedItem.text === '' ){
        return true
    }else{
        return false
    }
}

const phoneNumber = ref('')
const selectedCountry = ref({ valid: false });
const validationPhoneError = ref('');
const validationphoneEmergencyError = ref('');

const customPhoneValidation = async (value, country) => {
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;
  editedItem.phone = value

  await check_user_phone(value)
  // console.log("test test : ",check_phone.value)
    
  if (selectedCountry.value.valid === undefined ) {
    validationPhoneError.value = '';
  }else if(selectedCountry.value.valid === false){
    validationPhoneError.value = 'Phone number is invalide !';
  }else if(check_phone.value === true){
    validationPhoneError.value = 'Phone number exist !';
  }else if(selectedCountry.value.valid === true && check_phone.value === false){
    validationPhoneError.value = 'valid';
  }
}

const customphoneEmergencyValidation = async (value, country) => {
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;
  editedItem.phone_emergency = value  

  await check_user_phone_emergency(value)
 
  console.log("test test : ",check_phone_emergency.value)

   if (selectedCountry.value.valid === undefined ) {
    validationphoneEmergencyError.value = '';
  }else if (selectedCountry.value.valid === false) {
    validationphoneEmergencyError.value = 'Phone number is invalide !';
  } else if(check_phone_emergency.value === true){
    validationphoneEmergencyError.value = 'Phone number exist !';
  }else if(selectedCountry.value.valid === true && check_phone_emergency.value === false){
    validationphoneEmergencyError.value ='valid';
  }
}

const isValidPassport = ref()
const messageValidNumPassport = ref('')
function validateNumPassport() {
  const isNationality = editedItem.nationality === company.value.nationality;

  if (editedItem.num_passport && lengthValidator(editedItem.num_passport,company.value.max_passport,company.value.min_passport) != true){
    // console.log("test 2")
    isValidPassport.value = false
    messageValidNumPassport.value = `Passport number must be between ${company.value.min_passport} and ${company.value.max_passport} characters !`
  }else if(check_passport.value === true){
    console.log("mawjouda cin !")
    isValidPassport.value = false;
    messageValidNumPassport.value = 'Passport number exist !';
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

const isValidcarte_id = ref()
const messageValidcarte_id = ref('')
function validatecarte_id() {
  const isNationality = editedItem.nationality === company.value.nationality;
  requiredValidator(editedItem.carte_id)

  if(!isNationality && !editedItem.carte_id ){
    // console.log("test 1")
    isValidcarte_id.value = false
    messageValidcarte_id.value = "carte id is required !"
  }else if (editedItem.carte_id && lengthValidator(editedItem.carte_id,8,6) != true){
    // console.log("test 2")
    isValidcarte_id.value = false
    messageValidcarte_id.value = "carte id must be between 6 and 8 characters !"
  }
  else{
    // console.log("test 3")
    isValidcarte_id.value = true
    messageValidcarte_id.value = ""
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidcarte_id.value
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
    messageValidCIN.value = "Cin number is required !";
  } else if (editedItem.cin && lengthValidator(editedItem.cin, company.value.max_cin,  company.value.min_cin) !== true) {
    // console.log("cin test 2")
    isValidCIN.value = false;
    messageValidCIN.value = `Cin number must be between ${company.value.min_cin} and ${company.value.max_cin} characters !`;
  }else if(check_cin.value === true){
    // console.log("mawjouda cin !")
    isValidCIN.value = false;
    messageValidCIN.value = 'Cin number exist !';
  } else {
    // console.log("cin ntest 3")
    isValidCIN.value = true;
    messageValidCIN.value = "";
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidCIN.value && editedItem.cin !== ''
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

  <v-row>
    <v-col>
      
      <div v-if="currentStep === 0">
        <!-- Contenu de l'étape Generale -->
        <v-row>

          <v-col>
            <v-text-field v-model="editedItem.last_name" label="Nom"
              :rules="[requiredValidator, lengthValidator(editedItem.last_name, 30, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.first_name" label="Prénom"
              :rules="[requiredValidator, lengthValidator(editedItem.first_name, 30, 3)]"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.date_birth" label="Date de naissance" type="date"
              :rules="[requiredValidator, dateMin18Max100Validator]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.place_birth" label="Lieu de naissance"
              :rules="[requiredValidator, lengthValidator(editedItem.place_birth, 30, 3)]"></v-text-field>
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
              :rules="[requiredValidator, lengthValidator(editedItem.address, 30, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.email" label="Email" 
              :rules="[requiredValidator, emailValidator(editedItem.email) , checkEmail(editedItem.email ) ] "></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.email_prof" label="Email professionnel" 
              :rules="[emailValidator(editedItem.email_prof) ,checkEmailProf(editedItem.email_prof )  ]"></v-text-field>
              <!-- (v) => check_email_prof  -->
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <vue-tel-input v-model:value="editedItem.phone" type="number" mode="international"
              :class="{ 'custom-input': (validationPhoneError !=='Phone number is invalide !', validationPhoneError !== 'Phone number exist !' ) , 'custom-input error-tel-input': (validationPhoneError === 'Phone number is invalide !', validationPhoneError === 'Phone number exist !') }"
              :rules="[requiredValidator(editedItem.phone), vueTelInputValidator(selectedCountry) ]" @input="customPhoneValidation" >
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message"  v-if="validationPhoneError !== 'valid'">{{ validationPhoneError }}</div>
          </v-col>
          <v-col>
            <vue-tel-input v-model:value="editedItem.phone_emergency" type="number" mode="international"
              :class="{ 'custom-input': (validationphoneEmergencyError  !=='Phone number is invalide !' , validationphoneEmergencyError !== 'Phone number exist !' ), 'custom-input error-tel-input': (validationphoneEmergencyError === 'Phone number is invalide !' ,  validationphoneEmergencyError === 'Phone number exist !' )}"
              :rules="[requiredValidator, vueTelInputValidator(selectedCountry)]" @input="customphoneEmergencyValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message" v-if="(validationphoneEmergencyError !== 'valid')">{{ validationphoneEmergencyError }}</div>
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
            <v-select v-model="editedItem.family_situation" :items="family_situationOptions" label="Situation familiale"
              :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="editedItem.nb_children" label="Nombre d'enfants"
              :rules="[requiredValidator, integerValidator(editedItem.nb_children)]"></v-text-field>
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
              v-model:value="editedItem.num_passport"
              separator="-"
              :input-classes="validateNumPassport()"
              :num-inputs="company.max_passport"
              input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"
              @input="checkPassport(editedItem.num_passport)"
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
              :input-classes="validateCIN()"  @input="checkCin(editedItem.cin)" />
              <div v-if="!isValidCIN.value" class="error-message v-input__details v-messages__message">
             {{ messageValidCIN }}
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="date" v-model="editedItem.delivery_date_cin" label="Date de délivrance CIN"
            :rules="[editedItem.cin !== null ? (requiredValidator, dateMinNowMax100Validator) : true ]"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="editedItem.delivery_place_cin" label="Lieu de délivrance CIN" 
            :rules="[editedItem.cin !== null ? (requiredValidator,lengthValidator(editedItem.delivery_place_cin , 30,3)) : true ]" ></v-text-field>
          </v-col>
        </v-row>
        <v-row cols="12" v-if="isCardIdAndCinRequired() === true">  <!-- -->
          <v-col md="2" class="margin-title">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> ID Card
          </v-col>
          <v-col cols="12" md="10">
            <v-text-field v-model="editedItem.carte_id" label="Card id" 
              :class="{ 'error-input' : isValidcarte_id }"
              :style="{ 'border-color': isValidcarte_id ? 'red' : '', 'border-radius': '5px' }"
              :rules="[requiredValidator(editedItem.carte_id) , lengthValidator(editedItem.carte_id, 50, 3)]"
              @input="validatecarte_id()">
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
            <v-text-field v-model="editedItem.level_studies" label="Niveau d'études"
            :rules="[requiredValidator, lengthValidator(editedItem.level_studies, 30, 4)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.specialty" label="Spécialité" 
            :rules="[requiredValidator, lengthValidator(editedItem.specialty, 30, 4)]"></v-text-field>
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
            <v-text-field type="date" v-model="editedItem.integration_date" label="Date d'intégration"
            :rules="[requiredValidator , dateIntegrationValidator(editedItem.integration_date , editedItem.date_birth)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.registration" label="registration" 
            :rules="[requiredValidator, lengthValidator(editedItem.specialty, 30, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="editedItem.department_id" :items="departments_list" item-title="department_name"
              item-value="id" @change="updateTeamList" @click="updateTeamList" label="Département" :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-select v-model="editedItem.team_id" :items="team_list" item-title="name" item-value="id"
              label="Équipe"  :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="editedItem.position_id" :items="positions_list" item-title="job_name"
              item-value="id"  label="Position" :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="editedItem.regime_social" :items="regimeSocialOptions" item-title="regime_social"
              item-value="regime_social" label="Régime social"  :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="editedItem.text" label="Autre Régime Social"  :rules="[ lengthValidator(editedItem.text, 30, 4)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="emitSave" :disabled="!validateStep6()">Save</v-btn>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-row>

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
