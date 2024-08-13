<script setup lang="ts">
definePageMeta({
  layout: false,
});

import type { FormSubmitEvent } from "#ui/types";
import type { z } from "zod";
import { useUserSchema } from "~/schemas/userSchema";

type Schema = z.output<typeof useUserSchema>;

const state = reactive({
  username: undefined,
  password: undefined,
});
const token = useTokenStore();
const auth = useAuthStore();
const toast = useToast();
const loading = ref(false);
const data = "";

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const response = await auth.login(event.data);
    if (response.status !== 200) {
      toast.add({
        title: response.data.message,
        color: "red",
        ui: {
          title: "text-red-500",
        },
      });
    }

    token.setToken(response.data.access_token);
    token.setId(response.data.data.id);
    token.setSiteId(response.data.data.type_site_id);
    token.setLocalities(response.data.data.localite);
    token.setRegion(response.data.data.region);
    token.setNom(response.data.data.nom);

    console.log(response.data);

    navigateTo("/");
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Ooops, une erreur est survenue",
      color: "red",
      ui: {
        title: "text-red-500",
      },
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <UCard
      :ui="{
        shadow: 'shadow-xl',
        body: {
          background: 'bg-white',
          base: 'text-primary rounded-lg w-[400px]',
        },
      }"
    >
      <h1 class="mb-5 text-xl font-bold text-center">Connectez-vous</h1>
      <UForm
        :state="state"
        :schema="useUserSchema"
        class="space-y-5"
        @submit="handleSubmit"
      >
        <UFormGroup name="username">
          <UInput
            placeholder="Nom d'utilisateur"
            size="lg"
            icon="i-heroicons-user"
            v-model="state.username"
          />
        </UFormGroup>
        <UFormGroup name="password">
          <UInput
            type="password"
            placeholder="Mot de passe"
            size="lg"
            icon="i-heroicons-key"
            v-model="state.password"
          />
        </UFormGroup>
        <UButton
          label="Se connecter"
          block
          size="lg"
          type="submit"
          :loading="loading"
        />
      </UForm>
    </UCard>
  </div>

  <UNotifications />
</template>
