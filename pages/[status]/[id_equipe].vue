<script setup lang="ts">
const activeStep = ref(0);
const length = ref(1);
const dataStore = useDataStore();

const nextStep = () => {
  if (activeStep.value < length.value) {
    activeStep.value++;
  } else {
    console.log(dataStore.collectedData);
  }
};

const previousStep = () => {
  if (activeStep.value >= length.value) {
    activeStep.value--;
  } else {
    navigateTo("/");
    
  }
};
</script>

<template>
  <div class="w-full flex justify-center mt-5">
    <div class="grid grid-cols-2 gap-4" v-show="activeStep === 0">
      <TableWithoutInput />

      <div></div>
      <div class="flex justify-between h-[40px] w-full"></div>
    </div>

    <div
      class="w-3/6 flex flex-col justify-center space-y-4"
      v-show="activeStep === 1"
    >
      <BilanUser />
    </div>
  </div>
  <div class="flex justify-center space-x-4 mt-5">
    <UButton label="Retour" color="gray" @click="previousStep" />
    <UButton
      :label="activeStep === length ? 'Terminer' : 'Suivant'"
      @click="nextStep"
    />
  </div>
  <!-- <div>
    <FormulaireCamion />
    <div class="flex justify-end mt-4">
      <UButton label="Terminer" @click="activeStep = 1" />
    </div>
  </div> -->
</template>
