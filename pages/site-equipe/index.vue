<script setup lang="ts">
const data = [
  {
    libelle: "Equipe A",
    nbr_agent: 0,
  },
  {
    libelle: "Equipe B",
    nbr_agent: 0,
  },
  {
    libelle: "Equipe C",
    nbr_agent: 0,
  },
];
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="grid grid-cols-4 gap-4">
      <UCard
        v-for="row in data"
        :ui="{ rounded: 'rounded-none', shadow: 'shadow-lg' }"
      >
        <h1 class="text-green-500 text-lg font-bold">{{ row.libelle }}</h1>
        <p class="mb-4">Nombre d'agent : {{ row.nbr_agent }}</p>
        <UButton
          color="blue"
          block
          size="lg"
          label="Ajouter des agents"
          @click="navigateTo('/site-equipe/equipe_a/')"
        />
      </UCard>
    </div>
  </div>
</template>
