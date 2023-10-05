<script setup lang="ts">
import { useUserSession } from '@/stores/userSession';
import { VForm } from 'vuetify/components';

const isPasswordVisible = ref(false)
const { login } = useUserSession()
const router = useRouter()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

// const email = ref(import.meta.env.VITE_APP_EMAIL && import.meta.env.VITE_APP_EMAIL.length != 0 ? import.meta.env.VITE_APP_EMAIL : '')
// const password = ref(import.meta.env.VITE_APP_PASSWORD && import.meta.env.VITE_APP_PASSWORD.length != 0 ? import.meta.env.VITE_APP_PASSWORD : '')

const refVForm = ref<VForm>()

// const email = ref(import.meta.env.VITE_APP_EMAIL && import.meta.env.VITE_APP_EMAIL.length != 0 ? import.meta.env.VITE_APP_EMAIL : '')
// const password = ref(import.meta.env.VITE_APP_PASSWORD && import.meta.env.VITE_APP_PASSWORD.length != 0 ? import.meta.env.VITE_APP_PASSWORD : '')
const email = ref('nourguerfali08@gmail.com')
const password = ref('123456789')
const rememberMe = ref(false)

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid){
      login({ email: email.value, password: password.value }).then(res => {
        localStorage.setItem('userData', JSON.stringify(res.user))
            router.push({ name: 'dashboard' })
      })
    }
  })
}

const forgotPassword = () => {
     router.push({ name: 'forgot-password' })
}

</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
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
          Please sign-in to your account and start the adventure
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
                autofocus
                label="Email"
                type="email"
                :rules="[requiredValidator, emailValidator]"
                :error-messages="errors.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="errors.password"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="rememberMe"
                  label="Remember me"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  :to="{ name: 'forgot-password' }"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </RouterLink>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
