<script setup lang="ts">
// import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { useUserSession } from '@/stores/userSession';
import { VForm } from 'vuetify/components';

const router = useRouter()
const { resetPassword } = useUserSession()

const errors = ref<Record<string, string | undefined>>({
  code: undefined,
  password_confirmation: undefined,
  password: undefined
})

const refVForm = ref<VForm>()
const code = ref('')
const password_confirmation = ref('')
const password = ref('')

const onSubmit = () => {
  code.value = JSON.parse(localStorage.getItem('code'))
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      resetPassword({ code: code.value, password: password.value, password_confirmation: password_confirmation.value }).then(res => {
        localStorage.removeItem('code')
        router.push({ name: 'login' })
      })
    }
  })
}

</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center">
    <VCard class="auth-card pa-4 pt-7" max-width="600">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div class="d-flex text-primary" v-html="logo" />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          Digitrends
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Welcome ! 👋🏻
        </h5>
        <p class="mb-0">
          Verif code
        </p>
      </VCardText>

      <VCardText>
        <VForm ref="refVForm" @submit.prevent="onSubmit">
          <VRow>
            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="password" label="Password" />
            </VCol>

            <!-- password_confirmation -->
            <VCol cols="12">
              <VTextField v-model="password_confirmation" label="Password confirmation" />
            </VCol>

            <!-- Reset link -->
            <VCol cols="12">
              <VBtn block type="submit">
                Verif code
              </VBtn>
            </VCol>

            <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4"></span>
              <VDivider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
</style>


