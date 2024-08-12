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
const title1 = "Confirmez les kits et imprimantes utilisées le ";
const text = "Décochez un kit ou une imprimante s'il n'a pas été utilisé !";

const title2 = "Quel a été la performance de l'";
const text2 =
  "Veuillez saisir :\n soit le nombre d'enrôlement total de l'équipe, soit le nombre fait par agent. - la tranche horaire de travail pendant laquelle l'équipe a travaillé.";
const title3 = "Veuillez vérifier les données de distribution";
const text3 = "Veuillez confirmer les données relatives à la distribution.";
const equipe: any = route.params.status;

// Vérifiez si le paramètre type_operation est égal à 3
if (route.params.type_operation == "3") {
  length.value = 2; // Ajoutez une étape supplémentaire si type_operation est égal à 3
}

async function handleSubmit() {
  loading.value = true;
  try {
    const response = await dataStore.addData(dataStore.collectedData);

    if (response.message == 201) {
      dataStore.deleteData();
      dataStore.deleteDate();
      navigateTo("/");
    } else {
      alert("Une erreur est survenue !");
      console.log(response);
    }
  } catch (error) {
    console.log(error);
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
    handleSubmit();
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
  <div v-if="length > 1">
    <div class="my-5 flex justify-center">
      <div class="w-[650px]">
        <h1 class="text-center font-bold text-2xl mb-3">
          <!-- Adapter le titre en fonction de l'étape -->
          {{
            activeStep == 0 ? title1 : activeStep == 1 ? `${title3}` : title2
          }}
          <span v-if="activeStep !== 0" class="text-blue-500"
            >{{ formatEquipeName(equipe.replace("_", " ")) }}
            <span class="text-black">?</span></span
          >
          <span v-else class="text-blue-500">
            {{ token.getDateSelected }}
          </span>
        </h1>
        <!-- Adapter le texte en fonction de l'étape -->
        <p class="text-xs font-thin italic text-gray-400 text-center">
          <span class="text-red-500">*</span>
          {{ activeStep == 0 ? text : activeStep == 1 ? text3 : text2 }}
        </p>
      </div>
    </div>
    <div class="w-full flex justify-center mt-10">
      <div class="grid grid-cols-2 gap-4" v-show="activeStep === 0">
        <TableWithoutInput />

        <div></div>
        <div class="flex justify-between h-[40px] w-full"></div>
      </div>

      <!-- Ajouter une nouvelle étape pour l'étape supplémentaire -->
      <div
        class="w-3/6 flex flex-col justify-center space-y-4"
        v-show="activeStep === 1"
      >
        <FormulaireCamion />
      </div>

      <div
        class="w-3/6 flex flex-col justify-center space-y-4"
        v-show="activeStep === 2"
      >
        <BilanUser />
      </div>
    </div>
    <div class="flex justify-center space-x-4 mt-5">
      <UButton label="Retour" color="gray" @click="previousStep" />
      <UButton
        :loading="loading"
        :label="activeStep === length ? 'Terminer' : 'Suivant'"
        @click="nextStep"
      />
    </div>
  </div>

  <div v-else>
    <div class="my-5 flex justify-center">
      <div class="w-[650px]">
        <h1 class="text-center font-bold text-2xl mb-3">
          {{ activeStep == 0 ? title1 : title2 }}
          <span v-if="activeStep !== 0" class="text-blue-500"
            >{{ formatEquipeName(equipe.replace("_", " ")) }}
            <span class="text-black">?</span></span
          >
          <span v-else class="text-blue-500">
            {{ token.getDateSelected }}
          </span>
        </h1>
        <p class="text-xs font-thin italic text-gray-400 text-center">
          <span class="text-red-500">*</span>
          {{ activeStep == 0 ? text : text2 }}
        </p>
      </div>
    </div>
    <div class="w-full flex justify-center mt-10">
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
        :loading="loading"
        :label="activeStep === length ? 'Terminer' : 'Suivant'"
        @click="nextStep"
      />
    </div>
  </div>
</template>
