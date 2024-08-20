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

const router = useRouter();
const manage = useManageStore();
const rows = ref<any>([]);
const isLoading = ref(false);

function formatEquipeName(equipe: string): string {
  return equipe
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Ajoute un espace entre une lettre minuscule suivie d'une majuscule
    .toLowerCase() // Transforme tout en minuscules
    .replace(/\b\w/g, (letter) => letter.toUpperCase()); // Met en majuscule la première lettre de chaque mot
}

async function getTeam() {
  isLoading.value = true;

  try {
    const response = await manage.getTeamBySite();
    rows.value = response;
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getTeam();
});
</script>

<template>
  <UProgress
    animation="carousel"
    size="xs"
    class="fixed top-0"
    v-if="isLoading"
  />
  <div class="container mx-auto py-4" v-else>
    <div class="grid grid-cols-4 gap-4">
      <UCard
        v-for="row in rows"
        :ui="{ rounded: 'rounded-none', shadow: 'shadow-lg' }"
      >
        <h1 class="text-green-500 text-lg font-bold capitalize">
          {{ formatEquipeName(row.nom_equipe) }}
        </h1>
        <!-- <p class="mb-4">Nombre d'agent : {{ row.nbr_agent }}</p> -->
        <UButton
          color="blue"
          block
          size="lg"
          label="Ajouter des agents"
          @click="router.push(`site-equipe/${row.id_equipe}/`)"
        />
      </UCard>
    </div>
  </div>
</template>
