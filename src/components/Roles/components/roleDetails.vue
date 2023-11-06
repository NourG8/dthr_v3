<script setup lang="ts">
import { useRole } from '@/stores/role';

// Store role
const { get_roles_positions_user } = useRole()
const { roles_positions_list } = storeToRefs(useRole())

const dialogDetails = ref(false)

interface Props {
    data: any;
}

const props = withDefaults(defineProps<Props>(), {});

onMounted(async () => {
    console.log(props.data)
    await get_roles_positions_user(props.data)
    console.log(roles_positions_list.value)
})

</script>

<template>
    <v-tabs bg-color="teal-darken-3" show-arrows align-with-title direction="vertical" slider-color="teal-lighten-3">
        <!-- lenght {{ roles_positions_list.length}} -->
        <v-tab v-for="i in roles_positions_list.length" :key="i" :value="'tab-' + i">
            {{ roles_positions_list[0].name }}
        </v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item value="option-1">
            <v-row class="mb-3 mt-1">
                <v-col>
                    <v-card flat color="#F4F5FA">
                        <v-card-title class="ml-6">Details</v-card-title>
                        <v-card-text class="pt-3 ml-15">
                            <v-row>
                                <v-col cols="12" md="5">
                                    <label for="firstname" class="ml-5">
                                        <b>Type Contracts : </b>
                                    </label>
                                </v-col>
                                <v-col cols="12" md="4"> Contracts "{{ item.type }}" </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-window-item>
    </v-window>

    <v-alert border="left" colored-border type="warning" dense elevation="2" v-if="roles_positions_list == 0">
        NoDataAvailable
    </v-alert>
</template>
