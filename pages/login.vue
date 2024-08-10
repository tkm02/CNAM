<script setup lang="ts">


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

    console.log(response.data);

    navigateTo("/");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
    <div class="container-form">
    <LoginForm/>

    </div>

</template>

<style>
.container-form{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>