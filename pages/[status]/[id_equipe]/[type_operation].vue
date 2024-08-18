<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const activeStep = ref(0);
const length = ref(1); // Définir le nombre d'étapes par défaut
const route = useRoute();
const dataStore = useDataStore();
const token = useTokenStore();
const loading = ref(false);
const title1 = "Confirmez les kits et imprimantes utilisées";
const text = "Décochez un kit ou une imprimante s'il n'a pas été utilisé !";

const title2 = "Quel a été la performance de l'";
  "- soit le nombre total d'enrôlements de l'équipe, soit le nombre d'enrôlements faits par chaque agent.";
const textOperation =
  route.params.type_operation == "1" ? "d'enrôlement" : "de production";

const equipe: any = route.params.status;
const toast = useToast();

async function handleSubmit() {
  loading.value = true;
  try {
    const response = await dataStore.addData(dataStore.collectedData);

    if (response.message == 201) {
      navigateTo("/recap/detail");
    } else {
      alert("Une erreur est survenue !");
      console.log(response);
    }
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Ooops, une erreur est survenue !",
      color: "red",
      ui: {
        title: "text-red-500",
      },
    });
  } finally {
    loading.value = false;
  }
}

function formatEquipeName(equipe: string): string {
  return equipe
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Ajoute un espace entre une lettre minuscule suivie d'une majuscule
    .toLowerCase() // Transforme tout en minuscules
    .replace(/\b\w/g, (letter) => letter.toUpperCase()); // Met en majuscule la première lettre de chaque mot
}

const nextStep = () => {
  if (activeStep.value < length.value) {
    activeStep.value++;
  } else {
    // handleSubmit();
    navigateTo("/tab-recap");
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
  <div>
    <div class="my-5 flex justify-center">
      <div class="w-[650px]">
        <h1 class="text-center text-black font-bold text-2xl mb-5">
          Enregistrement du rapport {{ textOperation }} du
          <span class="text-blue-500">
            {{ token.getDate }}
          </span>
        </h1>
        <h1 class="text-center font-semibold text-[#47A126] text-xl mb-3">
          {{ activeStep == 1 ? title1 : title2 }}
          <span v-if="activeStep !== 1" class="text-orange-500"
            >{{ formatEquipeName(equipe.replace("_", " ")) }}
            <span class="text-black">?</span></span
          >
        </h1>
      </div>
    </div>
    <div class="w-full flex justify-center mt-10">
      <div
        class="flex justify-start"
        :class="activeStep == 1 ? 'w-[810px]' : 'w-[1250px]'"
      >
        <div>
          <p
            class="text-xs font-thin italic"
            :class="activeStep === 1 ? 'text-red-500' : ''"
          >
            {{ activeStep == 1 ? "*" + text : "" }}
          </p>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center mt-2">
      <div class="grid grid-cols-1 gap-4" v-show="activeStep === 1">
        <TableWithoutInput />

        <div></div>
        <div class="flex justify-between h-[40px] w-full"></div>
      </div>

      <div
        class="w-3/6 flex flex-col justify-center space-y-4"
        v-show="activeStep === 0"
      >
        <BilanUser />
      </div>
    </div>
    <div class="flex justify-center space-x-4 mt-5 mb-6">
      <UButton label="Retour" color="gray" @click="previousStep" size="lg" />
      <UButton
        size="lg"
        :loading="loading"
        :label="activeStep === length ? 'Terminer' : 'Suivant'"
        @click="nextStep"
      />
    </div>
  </div>

  <UNotifications />
</template>
