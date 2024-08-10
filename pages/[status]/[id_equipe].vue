<script setup lang="ts">

const activeStep = ref(1);

// Synchroniser les inputValue avec mainInputValue
// watch(mainInputValue, (newValue, oldValue) => {
//   console.log(mainInputValue);
//   if (newValue > 0) {
//     people.map((person) => {
//       inputValuesArray.value = people.map((person) => person.inputValue);
//       console.log(person.inputValue);
//     });
//   }
// });
</script>

<template>
  <div class="p-4" v-if="activeStep == 1">
    <TableWithoutInput />
    <div class="flex justify-end mt-4">
      <UButton label="Suivant" @click="activeStep += 1" />
    </div>
  </div>

  <div>
    <FormulaireCamion />
    <div class="flex justify-end mt-4">
      <UButton label="Terminer" @click="activeStep = 1" />
    </div>
  </div>
</template>
