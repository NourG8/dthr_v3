<script setup lang="ts" >
import { lengthValidator, requiredValidator } from '@/@core/utils/validators';
import { usePermission } from '@/stores/permission';

// Store permission
const { get_permissions } = usePermission()
const { permissions_list } = storeToRefs(usePermission())

const editedItem = ref({
    // id: '',  
    name: '',
    // guard_name: '',
    permissions : []
});

onMounted(async () => {
    await get_permissions()
})

const emit = defineEmits(['save', 'close']);

const emitRoleSave = () => {
    // console.log(editedItem.value)
    // Vous émettez l'événement 'save'
    emit('save', editedItem.value);
};

const emitRoleClose = () => {
    // Vous émettez l'événement 'close'
    emit('close');
};

function validateForm() {
    return (
        requiredValidator(editedItem.value.name) === true &&
        lengthValidator(editedItem.value.name, 30, 5) === true 
        // &&
        // requiredValidator(editedItem.value.guard_name) === true
        )
}

</script>

<template>
    <v-row>
        <v-col>
            <v-text-field v-model="editedItem.name" label="Role name"
                :rules="[requiredValidator, lengthValidator(editedItem.name, 30, 5)]"></v-text-field>
        </v-col>
    </v-row>

    <!-- <v-row>
        <v-col>
            <v-textarea v-model="editedItem.guard_name" label="Description" :rules="[requiredValidator]"></v-textarea>
        </v-col>
    </v-row> -->

    <v-row>
        <v-col>
        <VSelect
                v-model="editedItem.permissions"
                multiple
                :items="permissions_list"
                item-value="id"
                item-title="name"
                plqce
                outlined dense placeholder="select permissions"
        />
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
