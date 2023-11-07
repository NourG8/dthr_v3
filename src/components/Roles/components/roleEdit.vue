<script setup lang="ts" >
import { lengthValidator, requiredValidator } from '@/@core/utils/validators';

const editedItem = ref({
    id: '',
    role: '',
    description: ''
});

const emit = defineEmits(['edit', 'close']);

const emitRoleSave = () => {
    console.log(editedItem.value)
    // Vous émettez l'événement 'save'
    emit('edit', editedItem.value);
};

const emitRoleClose = () => {
    // Vous émettez l'événement 'close'
    emit('close');
};

interface Props {
    data: any;
}
const props = withDefaults(defineProps<Props>(), {});

onMounted(async () => {
    console.log(props.data)
    editedItem.value = props.data
})

function validateForm() {
    return (
        requiredValidator(editedItem.value.role) === true &&
        lengthValidator(editedItem.value.role, 30, 5) === true &&
        requiredValidator(editedItem.value.description) === true)
}

</script>

<template>
    <v-row>
        <v-col>
            <v-text-field v-model="editedItem.role" label="Role name"
                :rules="[requiredValidator, lengthValidator(editedItem.role, 30, 5)]"></v-text-field>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-textarea v-model="editedItem.description" label="Description" :rules="[requiredValidator]"></v-textarea>
        </v-col>
    </v-row>

    <v-card-actions class="mt-4">
        <span></span>
        <v-spacer></v-spacer>
        <v-btn class="custom-primary-bg" outlined @click="emitRoleSave" :disabled="!validateForm()">
            Save
        </v-btn>
        <v-btn type="reset" outlined class="mx-2" @click="emitRoleClose">
            Cancel
        </v-btn>
    </v-card-actions>
</template>

<style>
.custom-primary-bg {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
}
</style>
