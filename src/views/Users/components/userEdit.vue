<script setup lang="ts">
import Draggable from 'vuedraggable';

interface Props {
  data: any;
}

const props = withDefaults(defineProps<Props>(), {});

onMounted(() => {
  console.log(props.data)
  getCINArray()
})

function getCINArray() {
  if (props.data.cin) {
    props.data.cin = String(props.data.cin)
  }
  if (props.data.numPassport) {
    props.data.numPassport = String(props.data.numPassport)
  }
}

const shipping = ref(0)
const step = ref(1)

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

const list3 = ref([
  { id: 1, text: 'atmosphère' },
  { id: 2, text: 'professionnalisme' },
  { id: 3, text: 'Reconnaissance' },
  { id: 4, text: 'argent' },
  { id: 5, text: 'environnement de travail' }
])

function checkMove(e) {
  const draggedItem = list3.value[e.draggedContext.index];
  const replacedItem = list3.value[e.draggedContext.futureIndex];
  console.log("draggedItem : ", draggedItem)
  console.log("replacedItem : ", replacedItem)
  const tempId = draggedItem.id;
  draggedItem.id = replacedItem.id;
  replacedItem.id = tempId;
}

const currentStep = ref(0)

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
const regimeSocialOptions = ['Option 1', 'Option 2', 'Option 3']; // Remplace avec tes options réelles

</script>

<template>
  <v-row>
    <v-col v-for="(step, index) in steps" :key="index" class="text-center">
      <v-avatar :color="getAvatarColor(index)" class="avatar">
        {{ step.number }}
      </v-avatar>
      <span>{{ step.name }}</span>
      <!-- <div class="divider" v-if="index !== steps.length - 1"></div> -->
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <div v-if="currentStep === 0">
        <!-- Contenu de l'étape Generale -->
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.lastName" label="Nom"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.firstName" label="Prénom"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.dateBirth" label="Date de naissance"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.placeBirth" label="Lieu de naissance"></v-text-field>
          </v-col>
          <v-col>
            <v-select v-model="props.data.sex" :items="sexOptions" label="Sexe"></v-select>
          </v-col>
        </v-row>
      </div>
      <div v-else-if="currentStep === 1">
        <!-- Contenu de l'étape Contacts -->
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.address" label="Adresse"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="props.data.email" label="Email"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.emailProf" label="Email professionnel"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <vue-tel-input v-model="props.data.phone" class="custom-input"></vue-tel-input>
          </v-col>
          <v-col>
            <vue-tel-input :value="props.data.phoneEmergency" class="custom-input"></vue-tel-input>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 2">
        <!-- Contenu de l'étape Family Situation -->
        <v-row>
          <v-col>
            <v-select v-model="props.data.FamilySituation" :items="familySituationOptions"
              label="Situation familiale"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.nbChildren" label="Nombre d'enfants"></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 3">
        <!-- Contenu de l'étape Identity -->
        <v-row>
          <v-col md="2">
            <v-icon start icon="mdi-passport"></v-icon> passport number
          </v-col>
          <v-col md="5">
            <div style="display: flex; flex-direction: row">
              <v-otp-input ref="otpInput" :value="props.data.numPassport" input-classes="otp-input" separator="-"
                :num-inputs="8"  input-type="letter-numeric" 
                :conditionalClass="['one', 'two', 'three', 'four']"
                :placeholder="['*', '*', '*', '*', '*', '*', '*', '*']" />
            </div>
          </v-col>
          <v-col md="4">
            <v-text-field v-model="props.data.nationality" label="Nationalité"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="2">
            <v-icon start icon="mdi-card-account-mail-outline"></v-icon> CIN
          </v-col>
          <v-col md="5">
            <v-otp-input ref="otpInput" :value="props.data.cin" input-classes="otp-input" separator="-" :num-inputs="8"
               input-type="numeric" :placeholder="['*', '*', '*', '*', '*', '*', '*', '*']" />
          </v-col>
          <v-col md="2">
            <v-text-field type="date" v-model="props.data.deliveryDateCin" label="Date de délivrance CIN"></v-text-field>
          </v-col>
          <v-col md="2">
            <v-text-field v-model="props.data.deliveryPlaceCin" label="Lieu de délivrance CIN"></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 4">
        <!-- Contenu de l'étape Study -->
        <v-row>
          <v-col>
            <v-text-field v-model="props.data.levelStudies" label="Niveau d'études"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.specialty" label="Spécialité"></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="currentStep === 5">
        <!-- Contenu de l'étape Motivation -->
        <div class="card-scene">
          <h5 class="my-1">- Please rank the following motivations in order of importance : :</h5>
          <v-row class="my-8" align="center" justify="space-around">
            <Draggable :list="list3" :disabled="!enabled" item-key="name" class="list-group" ghost-class="ghost"
              :move="checkMove" @start="isDragging = true" @end="isDragging = false">
              <template #item="{ element }">
                <v-btn class="my-2 mx-2 list-group-item" :class="{ 'not-draggable': !enabled }">
                  {{ element.id }} - {{ element.text }}
                </v-btn>
              </template>
            </Draggable>
          </v-row>
        </div>
      </div>

      <div v-else-if="currentStep === 6">
        <!-- Contenu de l'étape Administrative -->
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="props.data.integrationDate" label="Date d'intégration"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.matricule" label="Matricule"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.department" :items="departmentOptions" label="Département"></v-select>
          </v-col>
          <v-col>
            <v-select v-model="props.data.team" :items="teamOptions" label="Équipe"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="props.data.regimeSocial" :items="regimeSocialOptions" label="Régime social"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="props.data.autreRegimeSocial" label="Autre Régime Social"></v-text-field>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-btn @click="previousStep" :disabled="currentStep === 0">Previous</v-btn>
    </v-col>
    <v-col class="text-right">
      <v-btn @click="nextStep" :disabled="currentStep === steps.length - 1">Next</v-btn>
    </v-col>
  </v-row>
</template>

<style>
.avatar {
  margin: 0 10px;
  /* Ajuste cette valeur selon l'espace souhaité entre les avatars */
}

.divider {
  height: 1px;
  width: 20%;
  /* Ajuste cette valeur selon la largeur souhaitée des lignes */
  background-color: grey;
  margin: 15px 0;
  /* Ajuste cette valeur selon l'espace souhaité entre les avatars et les lignes */
  display: inline-block;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.step-name {
  display: block;
  text-align: center;
  margin-top: 5px;
}

.custom-input {
  display: flex;
  height: 56px;
  border-radius: 5px;
}

.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
</style>
