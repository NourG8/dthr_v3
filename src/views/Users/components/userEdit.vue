<script setup lang="ts">
import { dateMaxValidator, dateMin18Validator, emailValidator, integerValidator, lengthValidator, requiredValidator, vueTelInputValidator } from '@/@core/utils/validators';
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
  updateTeamList()

  await get_companies()
  await getRegimeSocial()
  // console.log(company.value.max_cin)
  getCinAndPassportArray()
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
  if (props.data.cin) {
    props.data.cin = String(props.data.cin)
  } else {
    props.data.cin = String("")
  }
  if (props.data.numPassport) {
    props.data.numPassport = String(props.data.numPassport)
  } else {
    props.data.numPassport = String("")
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

const formData = reactive({
  // Les champs de la première étape
  lastName: '',
  firstName: '',
  dateBirth: '',
  placeBirth: '',
  sex: null,

  // Les champs de la deuxième étape
  address: '',
  email: '',
  emailProfessional: '',
  phone: '',
  phoneEmergency: '',

  // Les champs de la troisieme étape
  familySituation: '',
  nbChildren: '',

  // Les champs de la cinquieme étape
  numPassport: '',
  nationality: '',
  cin: '',
  deleveryDateCin: '',
  deleveryPlaceCin: '',

  specialty: '',
  levelStudies: '',

  //Les champs de la derniere étape
  integrationDate: '',
  matricule: '',
  department: null,
  team: null,
  regimeSocial: null,
  autreRegimeSocial: '',

  position_id: '',
  department_id: ''

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
}

function isCardIdAndCinRequired() {
  validateNumPassport()
  validateCarteId()
  validateCIN()

  return props.data.nationality !== nationality.value
}
const department = ref(props.data.department_id)
const team = ref(props.data.position_id)

function updateTeamList() {
  if (props.data.department_id) {
    get_teams_department(props.data.department_id);
  }
  if (props.data.department_id === department.value) {
    props.data.position_id = team.value
  } else {
    props.data.position_id = null;
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
    requiredValidator(props.data.lastName) === true &&
    lengthValidator(props.data.lastName, 15, 3) === true &&
    requiredValidator(props.data.firstName) === true &&
    lengthValidator(props.data.firstName, 15, 3) === true &&
    requiredValidator(props.data.dateBirth) === true &&
    dateMin18Validator(props.data.dateBirth) === true &&
    dateMaxValidator(props.data.dateBirth) === true))
  return (
    requiredValidator(props.data.lastName) === true &&
    lengthValidator(props.data.lastName, 15, 3) === true &&
    requiredValidator(props.data.firstName) === true &&
    lengthValidator(props.data.firstName, 15, 3) === true &&
    requiredValidator(props.data.dateBirth) === true &&
    dateMin18Validator(props.data.dateBirth) === true &&
    dateMaxValidator(props.data.dateBirth) === true)
}

function validateStep1() {
  return (
    requiredValidator(props.data.address) === true &&
    lengthValidator(props.data.address, 15, 3) === true &&
    requiredValidator(props.data.email) === true &&
    emailValidator(props.data.email) === true &&
    emailValidator(props.data.emailProf) === true &&
    requiredValidator(props.data.phone) === true &&
    validationPhoneError.value === '' &&
    requiredValidator(props.data.phoneEmergency) === true &&
    validationPhoneEmergencyError.value === ''
  );
}

function validateStep2() {
  return (
    requiredValidator(props.data.nbChildren) === true &&
    integerValidator(props.data.nbChildren) === true
  );
}

function validateStep3() {
  if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false && props.data.numPassport === ''
  ) {
    // Cas 1
    // console.log("nour cas 1 ")
    return true
  } else if (isCardIdAndCinRequired() === false && validateCIN()['error-tel-input'] === false && props.data.numPassport
    && lengthValidator(props.data.numPassport, company.value.max_passport, company.value.min_passport) === true) {
    // Cas 1
    // console.log("nour cas 2 ")
    return true
  } else if (isCardIdAndCinRequired() === true && requiredValidator(props.data.carteId) === true && lengthValidator(props.data.carteId, 50, 3) === true && isValidPassport.value) {
    // Cas 2
    //  console.log("nour cas 3 ")
    return true
  } else {
    // console.log("nour cas 4 ")
    return false
  }
}

function validateStep4() {
  return (
    requiredValidator(props.data.specialty) === true &&
    lengthValidator(props.data.specialty, 15, 4) === true &&
    lengthValidator(props.data.levelStudies, 15, 4) === true &&
    requiredValidator(props.data.levelStudies) === true
  );
}

function validateStep6() {
  return (
    requiredValidator(props.data.integrationDate) === true &&
    requiredValidator(props.data.department_id) === true &&
    requiredValidator(props.data.position_id) === true &&
    requiredValidator(props.data.regimeSocial) === true &&
    requiredValidator(props.data.text) === true
  );
}

function save() {
  console.log(props.data)
}

const phoneNumber = ref('')
const selectedCountry = ref({ valid: false });
const valid = ref(false);

const validationPhoneError = ref('');
const validationPhoneEmergencyError = ref('');

const customPhoneValidation = async (value, country) => {
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
  const isNationality = props.data.nationality === company.value.nationality;

  if (props.data.numPassport && lengthValidator(props.data.numPassport, company.value.max_passport, company.value.min_passport) != true) {
    // console.log("test 2")
    isValidPassport.value = false
    messageValidNumPassport.value = `Passport number must be between ${company.value.min_passport} and ${company.value.max_passport} characters !`
  }
  else {
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
  const isNationality = props.data.nationality === company.value.nationality;
  requiredValidator(props.data.carteId)

  if (!isNationality && !props.data.carteId) {
    // console.log("test 1")
    isValidCarteId.value = false
    messageValidCarteId.value = "carte id  is required !"
  } else if (props.data.carteId && lengthValidator(props.data.carteId, 8, 6) != true) {
    // console.log("test 2")
    isValidCarteId.value = false
    messageValidCarteId.value = "carte id  must be between 6 and 8 characters !"
  }
  else {
    // console.log("test 3")
    isValidCarteId.value = true
    messageValidCarteId.value = ""
  }

  console.log("Nourrrr :  ", requiredValidator(props.data.carteId))

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
    console.log("cin test 1")
    isValidCIN.value = false;
    messageValidCIN.value = "Le numéro de CIN est obligatoire !";
  } else if (props.data.cin && lengthValidator(props.data.cin, 8, 6) !== true) {
    console.log("cin test 2")
    isValidCIN.value = false;
    messageValidCIN.value = "Le numéro de CIN doit comporter entre 6 et 8 caractères !";
  } else {
    console.log("cin ntest 3")
    isValidCIN.value = true;
    messageValidCIN.value = "";
  }

  console.log("Validation du CIN : ", requiredValidator(props.data.cin));

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

  <v-row>
    <v-col>
      <div v-if="currentStep === 0">
        <!-- Contenu de l'étape Generale -->
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.lastName" label="Nom"
              :rules="[requiredValidator, lengthValidator(props.data.lastName, 15, 3)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.firstName" label="Prénom"
              :rules="[requiredValidator, lengthValidator(props.data.lastName, 15, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.dateBirth" label="Date de naissance" type="date"
              :rules="[requiredValidator, dateMin18Validator, dateMaxValidator(props.data.dateBirth)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.placeBirth" label="Lieu de naissance"
              :rules="[requiredValidator, lengthValidator(props.data.placeBirth, 15, 3)]"></v-text-field>
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
              :rules="[requiredValidator, lengthValidator(props.data.address, 15, 3)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.email" label="Email"
              :rules="[requiredValidator, emailValidator(props.data.email)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.emailProf" label="Email professionnel"
              :rules="[emailValidator(props.data.emailProf)]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <vue-tel-input :value="props.data.phone" type="number" mode="international"
              :class="{ 'custom-input': !validationPhoneError, 'error-tel-input': validationPhoneError }"
              :rules="[requiredValidator, vueTelInputValidator(selectedCountry)]" @input="customPhoneValidation">
            </vue-tel-input>
            <div class="error-message v-input__details v-messages__message">{{ validationPhoneError }}</div>
          </v-col>
          <v-col>
            <vue-tel-input :value="props.data.phoneEmergency" type="number" mode="international"
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
            <v-select v-model="props.data.FamilySituation" :items="familySituationOptions" label="Situation familiale"
              :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>{{ requiredValidator(props.data.nbChildren) }}
            <v-text-field v-model="props.data.nbChildren" label="Nombre d'enfants"
              :rules="[requiredValidator, integerValidator(props.data.nbChildren)]"></v-text-field>
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
          <v-col cols="12" md="2" class="mt-4">
            <v-icon start icon="mdi-passport"></v-icon> passport number
          </v-col>
          <v-col cols="12" md="5" class="mt-2">
            <v-otp-input ref="otpInput" v-model:value="props.data.numPassport" separator="-"
              :input-classes="validateNumPassport()" :num-inputs="company.max_passport" input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"></v-otp-input>
            <div v-if="!isValidPassport.value" class="error-message v-input__details v-messages__message">
              {{ messageValidNumPassport }}
            </div>
          </v-col>
          <v-col cols="12" md="4" class="mt-2 md:mt-0">
            <v-text-field v-model="props.data.nationality" @change="isCardIdAndCinRequired"
              @click="isCardIdAndCinRequired" label="Nationalité" :disabled="upd == 0"></v-text-field>
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
            <v-otp-input ref="otpInput" v-model:value="props.data.cin" separator="-" :num-inputs="company.max_cin"
              input-type="numeric" :placeholder="['*', '*', '*', '*', '*', '*', '*', '*']"
              :input-classes="validateCIN()" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="date" v-model="props.data.deliveryDateCin" label="Date de délivrance CIN"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="props.data.deliveryPlaceCin" label="Lieu de délivrance CIN"></v-text-field>
          </v-col>
        </v-row>
        <v-row cols="12" v-if="isCardIdAndCinRequired() === true"> <!-- -->
          <v-col md="2" class="margin-title">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> ID Card
          </v-col>
          <v-col cols="12" md="10">
            <v-text-field v-model="props.data.carteId" label="Card id" :class="{ 'error-input': isValidCarteId }"
              :style="{ 'border-color': isValidCarteId ? 'red' : '', 'border-radius': '5px' }"
              :rules="[requiredValidator(props.data.carteId), lengthValidator(props.data.carteId, 50, 3)]"
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
            <v-text-field v-model="props.data.levelStudies" label="Niveau d'études"
              :rules="[requiredValidator, lengthValidator(props.data.levelStudies, 15, 4)]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.specialty" label="Spécialité"
              :rules="[requiredValidator, lengthValidator(props.data.specialty, 15, 4)]"></v-text-field>
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
        <!-- Contenu de l'étape Motivation -->
        <div class="card-scene">
          <h5 class="my-1">- Please rank the following motivations in order of importance : :</h5>
          <v-row class="my-8" align="center" justify="space-around">
            <Draggable :list="listDragAndDrop" :disabled="!enabled" item-key="name" class="list-group" ghost-class="ghost"
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
            <v-text-field type="date" v-model="props.data.integrationDate" label="Date d'intégration"
              :rules="[requiredValidator]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.matricule" label="Matricule"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.department_id" :items="departments_list" item-title="departmentName"
              item-value="id" @change="updateTeamList" @click="updateTeamList" label="Département"
              :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-select v-model="props.data.position_id" :items="team_list" item-title="name" item-value="id" label="Équipe"
              :rules="[requiredValidator]"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.regimeSocial" :items="regimeSocialOptions" item-title="regimeSocial"
              item-value="regimeSocial" label="Régime social" :rules="[requiredValidator]"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.text" label="Autre Régime Social"
              :rules="[requiredValidator]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="previousStep">Previous</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="save()" :disabled="!validateStep6()">Save</v-btn>
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
