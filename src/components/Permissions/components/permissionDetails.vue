<script setup lang="ts">
import { usePermission } from '@/stores/permission';

// Store Permission
const { get_permissions_positions_user } = usePermission()
const { permissions_positions_list } = storeToRefs(usePermission())

const dialogDetails = ref(false)
const tab = ref(permissions_positions_list?.value[0]?.name)

interface Props {
    data: any;
}
const props = withDefaults(defineProps<Props>(), {});

onMounted(async () => {
    // console.log(props.data)
    await get_permissions_positions_user(props.data)
    // console.log(permissions_positions_list.value[0])
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
          <v-tab v-for="item in permissions_positions_list"
            :key="item.id"
            :value="item.name">
            <v-icon start icon="mdi-briefcase"></v-icon>
           {{item.name}}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item :value="item.name" :key="item.id" v-for="item in permissions_positions_list">
            <v-card flat>
              <v-card-text>
                <v-row v-for="user in item.children">
                  <v-col cols="12">
                    <v-icon start icon="mdi-account"></v-icon>
                    {{ user.name }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>

        <v-alert border="left" colored-border type="warning" dense elevation="2" v-if="permissions_positions_list.length == 0">
                  No Data Available 
                  </v-alert>
      </div>
    <!-- </v-card> -->
  </template>
