<script setup lang="ts">
// import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { useUserSession } from '@/stores/userSession';
import { VForm } from 'vuetify/components';

const router = useRouter()
const { forgotPassword } = useUserSession()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const refVForm = ref<VForm>()
const email = ref('')

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      forgotPassword({ email: email.value}).then(res => {
        //localStorage.setItem('userData', JSON.stringify(res.user))
          router.push({ name: 'verification-codes' })
      })
    }
  })
}

</script>

<template>
    <div class="auth-wrapper d-flex align-center justify-center">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="600"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          sneat
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Welcome to sneat! 👋🏻
        </h5>
        <p class="mb-0">
          Forgot password
        </p>
      </VCardText>

      <VCardText>
        <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
          <VRow>
               <!-- email -->
               <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Send Reset Link
                </VBtn>
              </VCol>

            <!-- back to login  -->
            <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                  <span>Back to login</span>
                </RouterLink>
              </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4"></span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <!-- <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol> -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
</style>


