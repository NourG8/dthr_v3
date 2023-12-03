<script setup lang="ts">
import { useRole } from '@/stores/role';

// Store role
const { get_role } = useRole()
const { role} = storeToRefs(useRole())

const dialogDetails = ref(false)
const tab = ref(role?.value[0]?.name)

interface Props {
    data: any;
}
const props = withDefaults(defineProps<Props>(), {});

onMounted(async () => {
    // console.log(props.data)
    await get_role(props.data)
    // console.log(role.value[0])
})

</script>

<template>
    <!-- <v-card> -->
      <div class="d-flex flex-row">
        <v-tabs
          v-model="tab"
          direction="vertical"
          color="primary"
        >
          <v-tab v-for="item in role.permissions"
            :key="item.id"
            :value="item.name">
            <v-icon start icon="mdi-briefcase"></v-icon>
           {{item.name}}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item :value="item.name" :key="item.id" v-for="item in role.permissions">
            <v-card flat>
              <v-card-text>
                {{ item.guard_name }}
              
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>

        <v-alert border="left" colored-border type="warning" dense elevation="2" v-if="role.length == 0">
                  No Data Available 
                  </v-alert>
      </div>
    <!-- </v-card> -->
  </template>
