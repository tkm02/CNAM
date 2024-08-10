<script setup lang="ts">
import { ModalMotifComponent } from "#components";

definePageMeta({
  middleware: "guest",
});
</script>
<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <Enregistrement />
  </div>
</template>
