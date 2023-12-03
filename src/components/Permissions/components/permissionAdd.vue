<script setup lang="ts" >
import { lengthValidator, requiredValidator } from '@/@core/utils/validators';

const editedItem = ref({
    id: '',
    name: '',
    // guard_name: '',
});

const emit = defineEmits(['save', 'close']);

const emitPermissionSave = () => {
    // console.log(editedItem.value)
    // Vous émettez l'événement 'save'
    emit('save', editedItem.value);
};

const emitPermissionClose = () => {
    // Vous émettez l'événement 'close'
    emit('close');
};

function validateForm() {
    return (
        requiredValidator(editedItem.value.name) === true &&
        lengthValidator(editedItem.value.name, 30, 5) === true )
}

</script>

<template>
    <v-row>
        <v-col>
            <v-text-field v-model="editedItem.name" label="permission name"
                :rules="[requiredValidator, lengthValidator(editedItem.name, 30, 5)]"></v-text-field>
        </v-col>
    </v-row>

    <v-card-actions class="mt-4">
        <span></span>
        <v-spacer></v-spacer>
        <v-btn class="custom-primary-bg" outlined @click="emitPermissionSave" :disabled="!validateForm()">
            Save
        </v-btn>
        <v-btn type="reset" outlined class="mx-2" @click="emitPermissionClose">
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
