<script setup lang="ts">
  interface Props {
    data: any;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const getColorStyle = () => ({
    color: props.data.sex === 'Male' ? '#42A5F5' : props.data.sex === 'Female' ? '#EDA8BF' : '',
  });

  const fields = [
    'last_name',
    'first_name',
    'address',
    'nationality',
    'sex',
    'registration',
    'email',
    'email_prof',
    'phone',
    'integration_date',
    'date_birth',
    'place_birth',
    'family_situation',
    'nb_children',
    'num_passport',
    'cin',
    'delivery_date_cin',
    'delivery_place_cin',
    'specialty',
    'level_studies',
    'carte_id',
    'regime_social',
  ];

  function formatDate(date: any) {
    return date ? `${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}` : '';
  }

  const iconMappings: Record<string, string> = {
  last_name: 'mdi-account-outline',
  first_name: 'mdi-account-outline',
  email: 'mdi-email-outline',
  email_prof: 'mdi-email-outline',
  sex:'mdi-gender-male-female',
  address: 'mdi-map-marker', 
  phone: 'mdi-cellphone',
  integration_date: 'mdi-calendar',
  date_birth: 'mdi-calendar',
  place_birth: 'mdi-map-marker-radius',
  nb_children: 'mdi-human-female-female',
  family_situation: 'mdi-security',
  nationality: 'mdi-credit-card',
  cin: 'mdi-account-box-outline',
  delivery_date_cin: 'mdi-calendar',
  delivery_place_cin: 'mdi-map-marker-radius',
  specialty: 'mdi-zodiac-taurus',
  level_studies: 'mdi-library',
  registration: 'mdi-badge-account-outline',
  carte_id: 'mdi-card-account-mail-outline',
  regime_social: 'mdi-badge-account-outline',
  num_passport: 'mdi-book',
};

const fieldLabels: Record<string, string> = {
  last_name: 'Nom',
  first_name: 'Prénom',
  email: 'Email',
  sex: 'Sex',
  email_prof: 'Email Professionnel',
  address: 'Adresse',
  phone: 'Téléphone',
  integration_date: 'Date d\'intégration',
  date_birth: 'Date de naissance',
  place_birth: 'Lieu de naissance',
  nb_children: 'Nombre d\'enfants',
  family_situation: 'Situation familiale',
  nationality: 'Nationalité',
  cin: 'CIN',
  delivery_date_cin: 'Date de délivrance CIN',
  delivery_place_cin: 'Lieu de délivrance CIN',
  specialty: 'Spécialités',
  level_studies: 'Niveau d\'études',
  registration: 'registration',
  carte_id: 'Carte ID',
  regime_social: 'Régime social',
  num_passport: 'Passport',
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
    case 'integration_date':
    case 'date_birth':
    case 'delivery_date_cin':
      return formatDate(props.data[fieldName]);
    case 'sex':
      return props.data[fieldName] ;
    case 'regime_social':
      return props.data[fieldName] ? `${props.data[fieldName]} (${props.data.text})` : ' ---- ';
    case 'last_name':
      return props.data[fieldName] || ' ---- ';
    case 'first_name':
      return props.data[fieldName] || ' ---- ';
    case 'email':
      return props.data[fieldName] || ' ---- ';
    case 'email_prof':
      return props.data[fieldName] || ' ---- ';
    case 'address':
      return props.data[fieldName] || ' ---- ';
    case 'phone':
      return props.data[fieldName] || ' ---- ';
    case 'place_birth':
      return props.data[fieldName] || ' ---- ';
    case 'nb_children':
      return  props.data[fieldName] ;
    case 'family_situation':
      return props.data[fieldName] || ' ---- ';
    case 'nationality':
      return props.data[fieldName] || ' ---- ';
    case 'cin':
      return props.data[fieldName] || ' ---- ';
    case 'delivery_place_cin':
      return props.data[fieldName] || ' ---- ';
    case 'specialty':
      return props.data[fieldName] || ' ---- ';
    case 'level_studies':
      return props.data[fieldName] || ' ---- ';
    case 'registration':
      return props.data[fieldName] || ' ---- ';
    case 'carte_id':
      return props.data[fieldName] || ' ---- ';
    case 'num_passport':
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
