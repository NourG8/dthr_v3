<script setup lang="ts">
import { useRole } from '@/stores/role';

// Store
const { get_roles, get_archived_roles } = useRole()
const { roles_list, roles_list_archived, loading } = storeToRefs(useRole())


const initialize = async () => {
    await get_roles()
}

onMounted(async () => {
    await initialize()
    console.log(roles_list.value)
    // await get_archived_roles()

     console.log("loading ",loading.value)
    // for (const i in ltop_List.value)
    //     panel.value.push(i)
    // console.log(loading)
})

watch(async () =>{
    await get_roles()
    console.log(loading.value)
})

</script>

<template>
    <VCard min-height="250px" class="mb-2">
        <VCol cols="12" md="12">
            <div class="text-center"  >
                <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
            </div>
            <div >
                <rolesList  />
            </div>
        </VCol>
    </VCard>
</template>

<style scoped>
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
