<script setup lang="ts">
const selectedPeople = ref<any[]>([]);
const searchQuery = ref("");
const maxVisibleItems = ref(5);
const route = useRoute();
const manage = useManageStore();
const availablePeople = ref<any[]>([]);

async function getAgentNotAssign() {
  try {
    const response = await manage.getAgentWhoNotTeam();
    if (response) {
      availablePeople.value = response;
    } else {
      console.log("Aucun agent disponible n'a été trouvé.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des agents non assignés :",
      error
    );
  }
}

async function getAgentByEquip() {
  try {
    const response = await manage.getAgentsByEquipe(
      Number(route.params.equipe)
    );
    if (response) {
      selectedPeople.value = response; // Remplir selectedPeople avec les agents de l'équipe
    } else {
      console.log("Aucun agent trouvé pour cette équipe.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des agents par équipe :",
      error
    );
  }
}

const filteredAvailablePeople = computed(() => {
  if (!searchQuery.value) {
    return availablePeople.value.slice(0, maxVisibleItems.value);
  }
  return availablePeople.value
    .filter((person: any) =>
      person.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .slice(0, maxVisibleItems.value);
});

const selectPeople = () => {
  const selected = availablePeople.value.filter(
    (person: any) => person.selected
  );
  selectedPeople.value.push(...selected);
  availablePeople.value = availablePeople.value.filter(
    (person: any) => !person.selected
  );
};

const deselectPeople = () => {
  const deselected = selectedPeople.value.filter(
    (person: any) => person.selected
  );
  availablePeople.value.push(...deselected);
  selectedPeople.value = selectedPeople.value.filter(
    (person: any) => !person.selected
  );
};

const toggleSelection = (list: any, person: any) => {
  const item = list.value.find((p: any) => p.agent_id === person.agent_id);
  if (item) {
    item.selected = !item.selected;
  }
};

onMounted(() => {
  getAgentNotAssign();
  getAgentByEquip();
});
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="mb-5 text-center font-bold text-xl">
      Ajouter les agents à l'équipe A
    </h1>
    <div class="flex flex-col md:flex-row justify-between items-center">
      <UCard class="flex-1 min-h-[300px] mb-4 md:mb-0 w-full">
        <template #header>
          <UInput
            v-model="searchQuery"
            placeholder="Recherche"
            icon="i-heroicons-magnifying-glass"
            trailing
          />
        </template>
        <div
          v-for="person in filteredAvailablePeople"
          :key="person.agent_id"
          class="mb-4"
        >
          <UCheckbox
            :label="person.nom"
            v-model="person.selected"
            @change="toggleSelection(availablePeople, person)"
          />
        </div>
      </UCard>

      <!-- Boutons de transfert -->
      <div class="flex flex-col space-y-5 mx-4 mb-4">
        <UButton
          color="green"
          icon="i-heroicons-arrow-right"
          @click="selectPeople"
        />
        <UButton
          color="red"
          icon="i-heroicons-arrow-left"
          @click="deselectPeople"
        />
      </div>

      <!-- Carte des éléments sélectionnés -->
      <UCard class="flex-1 min-h-[300px] w-full">
        <div
          v-for="person in selectedPeople"
          :key="person.agent_id"
          class="mb-4"
        >
          <UCheckbox
            :label="person.nom_agent"
            v-model="person.selected"
            @change="toggleSelection(selectedPeople, person)"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
