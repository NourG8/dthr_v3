<script setup lang="ts">
import { useUser } from '@/stores/user';

const {  get_user_contracts, get_user } = useUser()
const { contracts_list_user, users_list, user  } = storeToRefs(useUser())

const route = useRoute();
const tab = ref('')

onMounted(async () => { 
  await get_user(route.params.id)
  await get_user_contracts(route.params.id)
  // console.log(user.value)
  // console.log(contracts_list_user.value)
});

</script>

<template>
    <v-card class="card">
      <v-toolbar color="cyan" flat>
        <v-toolbar-title class="mb-6">Your contracts</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-slot:extension v-if="contracts_list_user.length != 0">
          <v-tabs v-model="tab" align-with-title class="mb-6">
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab v-for="(item, i) in contracts_list_user" :key="i"> contract {{ i + 1 }} </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-alert dense outlined v-if="contracts_list_user.length == 0" border="left" type="warning">
        Currently you have no contract !
      </v-alert>
      <v-tabs-items v-model="tab" v-if="contracts_list_user.length != 0">
        <v-tab-item v-for="(item, b) in contracts_list_user" :key="b">
          <v-row class="mb-3 mt-1">
            <v-col>
              <v-card flat color="#F4F5FA">
                <v-card-title class="ml-6">Details contract</v-card-title>
                <v-card-text class="pt-3 ml-15">
                  <v-row>
                    <v-col cols="12" md="5">
                      <label for="first_name" class="ml-5">
                        <b>Type Contracts : </b>
                      </label>
                    </v-col>
                    <v-col cols="12" md="4"> Contracts "{{ item.type }}" </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="5">
                      <label for="first_name" class="ml-5">
                        <b>StartDate : </b>
                      </label>
                    </v-col>
                    <v-col cols="12" md="4">
                      {{ item.startDate }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="5">
                      <label for="first_name" class="ml-5">
                        <b>EndDate : </b>
                      </label>
                    </v-col>
                    <v-col cols="12" md="4">
                      <span v-if="item.endDate != null && item.endDate != '0000-00-00'">{{ item.endDate }}</span>
                      <span v-if="item.endDate == null || item.endDate == '0000-00-00'">------------</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="5">
                      <label for="first_name" class="ml-5">
                        <b>TrialPeriod : </b>
                      </label>
                    </v-col>
                    <v-col cols="12" md="4">
                      <span v-if="item.trialPeriod != null">{{ item.trialPeriod }}</span>
                      <span v-if="item.trialPeriod == null">0</span>Months
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4">
                      <label for="first_name" class="ml-5">
                        <b>Status :</b>
                      </label>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chip class="ma-2 ml-9" color="primary" label outlined>
                        <v-icon left class="ml-1"  icon="mdi-playlist-edit">
                          <!-- {{ icons.mdiPlaylistEdit }} -->
                        </v-icon>
                        <span class="mr-1">{{ item.status }}</span>
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat color="#F4F5FA">
                <v-card-title class="ml-6">Download contract</v-card-title>
                <v-card-text class="text-center">
                  <div class="text-center mb-12">
                    <v-avatar tile color="blue" size="145px">
                      <v-img
                        v-if="item.fileContract != null && item.fileContract.split('.')[1] == 'docx'"
                        src="@/assets/images/DownloadFile/Word.png"
                      ></v-img>
                      <v-img
                        v-if="item.fileContract != null && item.fileContract.split('.')[1] == 'pdf'"
                        src="@/assets/images/DownloadFile/PDF.png"
                      ></v-img>
                      <v-img v-if="item.fileContract == null" src="@/assets/images/DownloadFile/NoFile.png"></v-img>
                    </v-avatar>
                  </div>
                  <p>
                    <v-btn color="primary" rounded depressed @click="downloadModelContractUser(item)">
                      <v-icon left>
                        cloud_download
                      </v-icon>
                     Contract_{{ item.type }}_{{ user?.last_name }}_{{ user?.first_name }}
                    </v-btn>
                    <input ref="uploader" class="d-none" type="file" accept="image/*" />
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </template>
  