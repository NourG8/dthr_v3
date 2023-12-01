<script setup lang="ts">
import { dateIntegrationValidator, dateMin18Max100Validator, dateMinNowMax100Validator, emailValidator, integerValidator, lengthValidator, requiredValidator, vueTelInputValidator } from '@/@core/utils/validators';
import { useCompany } from '@/stores/company';
import { useDepartment } from '@/stores/department';
import { usePosition } from '@/stores/position';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import Draggable from 'vuedraggable';

// Store position
const { get_positions } = usePosition()
const { positions_list, loading } = storeToRefs(usePosition())
// Store department
const { get_departments, get_teams_department } = useDepartment()
const { departments_list, team_list } = storeToRefs(useDepartment())
// Store company
const { get_companies } = useCompany()
const { companies_list } = storeToRefs(useCompany())

interface Props {
  data: any;
}

const props = withDefaults(defineProps<Props>(), {});

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
});

const company = ref()
const regimeSocialOptions = ref([]);
const nationality = ref()
async function getRegimeSocial() {
  company.value = JSON.parse(localStorage.getItem('companyData'));
  nationality.value = company.value.nationality;
 
  regimeSocialOptions.value = JSON.parse(company.value.regime_social)  
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

const formData = reactive({
  // Les champs de la première étape
  last_name: '',
  first_name: '',
  date_birth: '',
  place_birth: '',
  sex: null,

  // Les champs de la deuxième étape
  address: '',
  email: '',
  email_professional: '',
  phone: '',
  phone_emergency: '',

  // Les champs de la troisieme étape
  family_situation: '',
  nb_children: '',

  // Les champs de la cinquieme étape
  num_passport: '',
  nationality: '',
  cin: '',
  deleveryDateCin: '',
  deleveryPlaceCin: '',

  specialty: '',
  level_studies: '',

  //Les champs de la derniere étape
  integration_date: '',
  registration: '',
  department: null,
  team: null,
  regimeSocial: null,
  autreregimeSocial: '',

  team_id: '',
  department_id: '',
  position_id : null

});

const enabled = ref(true)

// const listDragAndDrop = ref([
//   { id: 1, text: 'atmosphère' },
//   { id: 2, text: 'professionnalisme' },
//   { id: 3, text: 'Reconnaissance' },
//   { id: 4, text: 'argent' },
//   { id: 5, text: 'environnement de travail' }
// ])

function checkMove(e) {
  const draggedItem = props.data.motivation[e.draggedContext.index];
  const replacedItem = props.data.motivation[e.draggedContext.futureIndex];

  const tempId = draggedItem.id;

  // Échanger les identifiants
  draggedItem.id = replacedItem.id;
  replacedItem.id = tempId;

  // Trier la liste en fonction des identifiants
  props.data.motivation.sort((a, b) => a.order - b.order);

  // const tempId = draggedItem.id;

  // draggedItem.id = replacedItem.id;
  // replacedItem.id = tempId;


}

function getCinAndPassportArray() {
  if (props.data.cin) {
    props.data.cin = String(props.data.cin)
  }else{
    props.data.cin = String("")
  }
  if (props.data.num_passport) {
    props.data.num_passport = String(props.data.num_passport)
  }else{
    props.data.num_passport = String("")
  }
}

function isCardIdAndCinRequired() {
  validatenum_passport()
  validateCarteId()
  validateCIN()

  if(props.data.nationality !== nationality.value){
   props.data.cin = ''
   props.data.delivery_date_cin = ''
   props.data.delivery_place_cin = ''
  }else{
    props.data.carte_id = ''
  }

  return props.data.nationality !== nationality.value
}
const department = ref(props.data.department_id)
const team = ref(props.data.team_id)

function updateTeamList() {
  if (props.data.department_id) {
    get_teams_department(props.data.department_id);
  }
  if (props.data.department_id === department.value) {
    props.data.team_id = team.value
  } else {
    props.data.team_id = null;
  }
}

const isFormValid = ref(false);
const currentStep = ref(0)

watch(async() =>  {
 await updateTeamList()
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
const familySituationOptions = ['Married', 'Divorced', 'Single'];
const isDragging = ref(false)

// const departmentOptions = ['Département 1', 'Département 2', 'Département 3']; // Remplace avec tes options réelles
// const teamOptions = ['Équipe 1', 'Équipe 2', 'Équipe 3']; // Remplace avec tes options réelles


function validateStep0() {
  return (
    requiredValidator(props.data.last_name) === true &&
    lengthValidator(props.data.last_name, 30, 3) === true &&
    requiredValidator(props.data.first_name) === true &&
    lengthValidator(props.data.first_name, 30, 3) === true &&
    requiredValidator(props.data.place_birth) === true &&
    lengthValidator(props.data.place_birth, 30, 3) === true &&
    requiredValidator(props.data.sex) === true &&
    requiredValidator(props.data.date_birth) === true &&
    dateMin18Max100Validator(props.data.date_birth) === true)
}

function validateStep1() {
  return (
    requiredValidator(props.data.address) === true &&
    lengthValidator(props.data.address, 30, 3) === true &&
    requiredValidator(props.data.email) === true &&
    emailValidator(props.data.email) === true &&
    emailValidator(props.data.email_prof) === true &&
    props.data.phone != ''&& props.data.phone_emergency &&
    validationPhoneError.value === 'valid' &&
    validationphone_emergencyError.value === 'valid'
  );
}

function validateStep2() {
  return (
    requiredValidator(props.data.nb_children) === true &&
    integerValidator(props.data.nb_children) === true
  );
}

function validateStep3() {
  if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false  && requiredValidator(props.data.delivery_date_cin) === true 
  && dateMinNowMax100Validator(props.data.delivery_date_cin) === true && requiredValidator(props.data.delivery_place_cin) === true 
  && lengthValidator(props.data.delivery_place_cin , 30,3) === true && props.data.num_passport === ''
) {
    return true
  } else if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false && props.data.num_passport 
  && requiredValidator(props.data.delivery_date_cin) === true && dateMinNowMax100Validator(props.data.delivery_date_cin) === true  
  && requiredValidator(props.data.delivery_place_cin) === true  && lengthValidator(props.data.delivery_place_cin , 30,3) === true
  && lengthValidator(props.data.num_passport,company.value.max_passport,company.value.min_passport) === true) {
    return true
  } else if(isCardIdAndCinRequired() === true && requiredValidator(props.data.carte_id) === true && lengthValidator(props.data.carte_id, 50, 3) === true && isValidPassport.value ){
    return true
  }else{
    return false
  }
}

function validateStep4() {
  return (
    requiredValidator(props.data.specialty) === true &&
    lengthValidator(props.data.specialty, 30, 4) === true &&
    lengthValidator(props.data.level_studies, 30, 4) === true &&
    requiredValidator(props.data.level_studies) === true
  );
}

function validateStep6() {

  if(props.data.text === null){
    props.data.text = ''
  }
  
  if( requiredValidator(props.data.integration_date) === true &&
    dateIntegrationValidator(props.data.integration_date , props.data.date_birth) === true &&
    requiredValidator(props.data.department_id) === true  &&
    requiredValidator(props.data.team_id) === true &&
    requiredValidator(props.data.regime_social) === true && 
    requiredValidator(props.data.registration) === true && 
    lengthValidator(props.data.registration, 30, 3) === true &&
    props.data.text !=null && lengthValidator(props.data.text, 30, 4) === true ){
       return true
    }else if( requiredValidator(props.data.integration_date) === true &&
    dateIntegrationValidator(props.data.integration_date , props.data.date_birth) === true &&
    requiredValidator(props.data.department_id) === true  &&
    requiredValidator(props.data.team_id) === true &&
    requiredValidator(props.data.registration) === true && 
    lengthValidator(props.data.registration, 30, 3) === true &&
    requiredValidator(props.data.regime_social) === true && props.data.text === '' ){
        return true
    }else{
        return false
    }
}

const phoneNumber = ref('')
const selectedCountry = ref({ valid: false });
const validationPhoneError = ref('');
const validationphone_emergencyError = ref('');

const customPhoneValidation = async (value, country) => {
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;
  props.data.phone = value
    
  if (selectedCountry.value.valid === undefined ) {
    validationPhoneError.value = '';
  }else if(selectedCountry.value.valid === false){
    validationPhoneError.value = 'Phone number is invalide !';
  }else{
    validationPhoneError.value = 'valid';
  }
}

const customphone_emergencyValidation = async (value, country) => {
  while (!country) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attend 100ms
  }
  selectedCountry.value = country;
  phoneNumber.value = value;
  props.data.phone_emergency = value  

  if (selectedCountry.value.valid === undefined ) {
    validationphone_emergencyError.value = '';
  }else if (selectedCountry.value.valid === false) {
    validationphone_emergencyError.value = 'Phone number is invalide !';
  } else {
    validationphone_emergencyError.value ='valid';
  }
}

const isValidPassport = ref()
const messageValidnum_passport = ref('')
function validatenum_passport() {
  const isNationality = props.data.nationality === company.value.nationality;

  if (props.data.num_passport && lengthValidator(props.data.num_passport,company.value.max_passport,company.value.min_passport) != true){
    isValidPassport.value = false
    messageValidnum_passport.value = `Passport number must be between ${company.value.min_passport} and ${company.value.max_passport} characters !`
  }
  else{
    isValidPassport.value = true
    messageValidnum_passport.value = ""
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidPassport.value
  };
}

const isValidCarteId = ref()
const messageValidcarte_id = ref('')
function validateCarteId() {
  const isNationality = props.data.nationality === company.value.nationality;
  requiredValidator(props.data.carte_id)

  if(!isNationality && !props.data.carte_id ){
    isValidCarteId.value = false
    messageValidcarte_id.value = "carte id is required !"
  }else if (props.data.carte_id && lengthValidator(props.data.carte_id,8,6) != true){
    isValidCarteId.value = false
    messageValidcarte_id.value = "carte id must be between 6 and 8 characters !"
  }
  else{
    isValidCarteId.value = true
    messageValidcarte_id.value = ""
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidCarteId.value
  };
}

const isValidCIN = ref();
const messageValidCIN = ref('');

function validateCIN() {
  const isNationality = props.data.nationality === company.value.nationality;
  requiredValidator(props.data.cin);

  if (isNationality && !props.data.cin) {
    isValidCIN.value = false;
    messageValidCIN.value = "Cin number is required !";
  } else if (props.data.cin && lengthValidator(props.data.cin, company.value.max_cin,  company.value.min_cin) !== true) {
    isValidCIN.value = false;
    messageValidCIN.value = `Cin number must be between ${company.value.min_cin} and ${company.value.max_cin} characters !`;
  } else {
    isValidCIN.value = true;
    messageValidCIN.value = "";
  }

  return {
    'otp-input': true,
    'error-tel-input': !isValidCIN.value && props.data.cin !== ''
  };
}

const emit = defineEmits(['update'])
const emitupdate = () => {
  // Vous émettez l'événement 'update'
  // props.data parametre de l'evenement update
  emit('update', props.data);
};

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
            <v-text-field v-model="props.data.last_name" label="Nom"
              :rules="[requiredValidator, lengthValidator(props.data.last_name, 30, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.first_name" label="Prénom"
              :rules="[requiredValidator, lengthValidator(props.data.last_name, 30, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.date_birth" label="Date de naissance" type="date"
              :rules="[requiredValidator, dateMin18Max100Validator]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.place_birth" label="Lieu de naissance"
              :rules="[requiredValidator, lengthValidator(props.data.place_birth, 30, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-select v-model="props.data.sex" :items="sexOptions" label="Sexe" :rules="[requiredValidator]"></v-select>
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
            <v-text-field v-model="props.data.address" label="Adresse"
              :rules="[requiredValidator, lengthValidator(props.data.address, 30, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.email" label="Email"
              :rules="[requiredValidator, emailValidator(props.data.email)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.email_prof" label="Email professionnel"
              :rules="[emailValidator(props.data.email_prof)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <vue-tel-input v-model:value="props.data.phone" type="number" mode="international"
              :class="{ 'custom-input': validationPhoneError !=='Phone number is invalide !', 'custom-input error-tel-input': validationPhoneError === 'Phone number is invalide !' }"
              :rules="[requiredValidator(props.data.phone), vueTelInputValidator(selectedCountry)]" @input="customPhoneValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message"  v-if="validationPhoneError !== 'valid'">{{ validationPhoneError }}</div>
          </v-col>
          <v-col>
            <vue-tel-input  v-model:value="props.data.phone_emergency" type="number" mode="international"
              :class="{ 'custom-input': validationphone_emergencyError  !=='Phone number is invalide !', 'custom-input error-tel-input': validationphone_emergencyError === 'Phone number is invalide !' }"
              :rules="[requiredValidator, vueTelInputValidator(selectedCountry)]" @input="customphone_emergencyValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message" v-if="validationphone_emergencyError !== 'valid'">{{ validationphone_emergencyError }}</div>
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
            <v-select v-model="props.data.family_situation" :items="familySituationOptions" label="Situation familiale"
              :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.nb_children" label="Nombre d'enfants"
              :rules="[requiredValidator, integerValidator(props.data.nb_children)]"></v-text-field>
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
              v-model:value="props.data.num_passport"
              separator="-"
              :input-classes="validatenum_passport()"
              :num-inputs="company.max_passport"
              input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"
            ></v-otp-input>
            <div v-if="!isValidPassport.value" class="error-message v-input__details v-messages__message">
             {{ messageValidnum_passport }}
            </div>
          </v-col>
          <v-col cols="12" md="4" class="mt-2 md:mt-0">
            <v-text-field v-model="props.data.nationality" @change="isCardIdAndCinRequired" @click="isCardIdAndCinRequired"
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
            <v-otp-input ref="otpInput" :value="props.data.cin" separator="-"
              :num-inputs="company.max_cin" input-type="numeric"
              :placeholder="['*', '*', '*', '*', '*', '*', '*', '*']"
              :input-classes="validateCIN() " />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="date" v-model="props.data.delivery_date_cin" label="Date de délivrance CIN"
            :rules="[props.data.cin !== null ? (requiredValidator, dateMinNowMax100Validator) : true ]"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="props.data.delivery_place_cin" label="Lieu de délivrance CIN" 
            :rules="[props.data.cin !== null ? (requiredValidator,lengthValidator(props.data.delivery_place_cin , 30,3)) : true ]" ></v-text-field>
          </v-col>
        </v-row>
        <v-row cols="12" v-if="isCardIdAndCinRequired() === true">  <!-- -->
          <v-col md="2" class="margin-title">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> ID Card
          </v-col>
          <v-col cols="12" md="10">
            <v-text-field v-model="props.data.carte_id" label="Card id" 
              :class="{ 'error-input' : isValidCarteId }"
              :style="{ 'border-color': isValidCarteId ? 'red' : '', 'border-radius': '5px' }"
              :rules="[requiredValidator(props.data.carte_id) , lengthValidator(props.data.carte_id, 50, 3)]"
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
            <v-text-field v-model="props.data.level_studies" label="Niveau d'études"
              :rules="[requiredValidator, lengthValidator(props.data.level_studies, 30, 4)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.specialty" label="Spécialité"
              :rules="[requiredValidator, lengthValidator(props.data.specialty, 30, 4)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="nextStep" :disabled="!validateStep4()">Next</v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 5">
        <!-- {{ props.data.motivation }} -->
        <!-- Contenu de l'étape Motivation -->
        <div class="card-scene">
          <h5 class="my-1">- Please rank the following motivations in order of importance : :</h5>
          <v-row class="my-8" align="center" justify="space-around">
            <Draggable :list="props.data.motivation" :disabled="!enabled" item-key="name" class="list-group" ghost-class="ghost"
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
              <v-btn @click="nextStep">Next</v-btn>
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-else-if="currentStep === 6">
        <!-- Contenu de l'étape Administrative -->
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="props.data.integration_date" label="Date d'intégration"
            :rules="[requiredValidator , dateIntegrationValidator(props.data.integration_date , props.data.date_birth)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.registration" label="registration"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.department_id" :items="departments_list" item-title="department_name"
              item-value="id" @change="updateTeamList" @click="updateTeamList" label="Département"
              :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-select v-model="props.data.team_id" :items="team_list" item-title="name" item-value="id"
              label="Équipe"  :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.position_id" :items="positions_list" item-title="job_name"
              item-value="id"  label="Position" :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.regime_social" :items="regimeSocialOptions" item-title="regime_social"
              item-value="regime_social" label="Régime social" :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.text" label="Autre Régime Social"
              :rules="[props.data.text !== '' ? (requiredValidator,lengthValidator(props.data.text , 30,4)) : true]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="emitupdate" :disabled="!validateStep6()">Save</v-btn>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-row>

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
