<script setup lang="ts">
  interface Props {
    data: any;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const getColorStyle = () => ({
    color: props.data.sex === 'Man' ? '#42A5F5' : props.data.sex === 'Women' ? '#EDA8BF' : '',
  });

  const fields = [
    'lastName',
    'firstName',
    'address',
    'nationality',
    'sex',
    'matricule',
    'email',
    'emailProf',
    'phone',
    'integrationDate',
    'dateBirth',
    'placeBirth',
    'FamilySituation',
    'nbChildren',
    'numPassport',
    'cin',
    'deliveryDateCin',
    'deliveryPlaceCin',
    'specialty',
    'levelStudies',
    'carteId',
    'regimeSocial',
   
  ];

  function formatDate(date: any) {
    return date ? `${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}` : '';
  }

  const iconMappings: Record<string, string> = {
  lastName: 'mdi-account-outline',
  firstName: 'mdi-account-outline',
  email: 'mdi-email-outline',
  emailProf: 'mdi-email-outline',
  sex:'mdi-gender-male-female',
  address: 'mdi-map-marker', 
  phone: 'mdi-cellphone',
  integrationDate: 'mdi-calendar',
  dateBirth: 'mdi-calendar',
  placeBirth: 'mdi-map-marker-radius',
  nbChildren: 'mdi-human-female-female',
  FamilySituation: 'mdi-security',
  nationality: 'mdi-credit-card',
  cin: 'mdi-account-box-outline',
  deliveryDateCin: 'mdi-calendar',
  deliveryPlaceCin: 'mdi-map-marker-radius',
  specialty: 'mdi-zodiac-taurus',
  levelStudies: 'mdi-library',
  matricule: 'mdi-badge-account-outline',
  carteId: 'mdi-card-account-mail-outline',
  regimeSocial: 'mdi-badge-account-outline',
  numPassport: 'mdi-book',
};

const fieldLabels: Record<string, string> = {
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'Email',
  sex: 'Sex',
  emailProf: 'Email Professionnel',
  address: 'Adresse',
  phone: 'Téléphone',
  integrationDate: 'Date d\'intégration',
  dateBirth: 'Date de naissance',
  placeBirth: 'Lieu de naissance',
  nbChildren: 'Nombre d\'enfants',
  FamilySituation: 'Situation familiale',
  nationality: 'Nationalité',
  cin: 'CIN',
  deliveryDateCin: 'Date de délivrance CIN',
  deliveryPlaceCin: 'Lieu de délivrance CIN',
  specialty: 'Spécialités',
  levelStudies: 'Niveau d\'études',
  matricule: 'Matricule',
  carteId: 'Carte ID',
  regimeSocial: 'Régime social',
  numPassport: 'Passport',
  // Ajoute d'autres champs et leurs labels ici
};

function getFieldLabel(field: string) {
  return fieldLabels[field] || field;
}

function getIcon(field: string) {
    return iconMappings[field] || '';
}

function getFieldContent(fieldName: string): string {
  switch (fieldName) {
    case 'integrationDate':
    case 'dateBirth':
    case 'deliveryDateCin':
      return formatDate(props.data[fieldName]);
    case 'sex':
      return props.data[fieldName] ;
    case 'regimeSocial':
      return props.data[fieldName] ? `${props.data[fieldName]} (${props.data.text})` : ' ---- ';
    case 'lastName':
      return props.data[fieldName] || ' ---- ';
    case 'firstName':
      return props.data[fieldName] || ' ---- ';
    case 'email':
      return props.data[fieldName] || ' ---- ';
    case 'emailProf':
      return props.data[fieldName] || ' ---- ';
    case 'address':
      return props.data[fieldName] || ' ---- ';
    case 'phone':
      return props.data[fieldName] || ' ---- ';
    case 'placeBirth':
      return props.data[fieldName] || ' ---- ';
    case 'nbChildren':
      return  props.data[fieldName] ;
    case 'FamilySituation':
      return props.data[fieldName] || ' ---- ';
    case 'nationality':
      return props.data[fieldName] || ' ---- ';
    case 'cin':
      return props.data[fieldName] || ' ---- ';
    case 'deliveryPlaceCin':
      return props.data[fieldName] || ' ---- ';
    case 'specialty':
      return props.data[fieldName] || ' ---- ';
    case 'levelStudies':
      return props.data[fieldName] || ' ---- ';
    case 'matricule':
      return props.data[fieldName] || ' ---- ';
    case 'carteId':
      return props.data[fieldName] || ' ---- ';
    case 'numPassport':
      return props.data[fieldName] || ' ---- ';

    default:
      return '-';
  }
}

</script>

<template>
  <div>
    <v-row>
      <v-col v-for="field in fields" :key="field" cols="12" md="6" v-if="props.data[field] !== null ">
  <span>
    <v-icon
      size="21"
      :style="getColorStyle()"
      :icon="getIcon(field)"
      class="mb-1 mr-1"
    ></v-icon>
    <span :style="getColorStyle()" class="font-weight-bold"> {{ getFieldLabel(field) }} : </span>
    <span style="color: black;" class="font-weight-bold"> {{ getFieldContent(field) }}</span>
  </span>
</v-col>

    </v-row>
  </div>
</template>

  
  <style lang=""></style>
