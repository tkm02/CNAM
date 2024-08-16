<script setup lang="ts">
import { ref, computed } from "vue";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
  { id: 7, name: "Caroline Schultz" },
  { id: 8, name: "Mason Heaney" },
  { id: 9, name: "Claudie Smitham" },
  { id: 10, name: "Emil Schaefer" },
];

// Listes pour les éléments disponibles et sélectionnés
const availablePeople = ref(people);
const selectedPeople = ref<any>([]);
const searchQuery = ref("");
const maxVisibleItems = ref(5);

// Propriété calculée pour filtrer les éléments disponibles en fonction de la recherche
const filteredAvailablePeople = computed(() => {
  if (!searchQuery.value) {
    return availablePeople.value.slice(0, maxVisibleItems.value); // Affiche seulement 5 noms par défaut
  }
  return availablePeople.value.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Fonction pour sélectionner des éléments
const selectPeople = () => {
  const selected = availablePeople.value.filter(
    (person: any) => person.selected
  );
  selectedPeople.value.push(...selected);
  availablePeople.value = availablePeople.value.filter(
    (person) => !person.selected
  );
};

// Fonction pour désélectionner des éléments
const deselectPeople = () => {
  const deselected = selectedPeople.value.filter((person) => person.selected);
  availablePeople.value.push(...deselected);
  selectedPeople.value = selectedPeople.value.filter(
    (person) => !person.selected
  );
};

// Fonction pour basculer la sélection
const toggleSelection = (list, person) => {
  const item = list.value.find((p) => p.id === person.id);
  if (item) item.selected = !item.selected;
};
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="mb-5 text-center font-bold text-xl">
      Ajouter les agents à l'équipe A
    </h1>
    <div class="flex flex-col md:flex-row justify-between items-center">
      <!-- Carte des éléments disponibles -->
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
          :key="person.id"
          class="mb-4"
        >
          <UCheckbox
            :label="person.name"
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
        <div v-for="person in selectedPeople" :key="person.id" class="mb-4">
          <UCheckbox
            :label="person.name"
            v-model="person.selected"
            @change="toggleSelection(selectedPeople, person)"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

