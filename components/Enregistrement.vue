<script setup lang="ts">
import { ref, computed } from "vue";
import DatePicker from "./DatePicker.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useManageStore } from "~/stores/manageStore";

const selectedDate = ref(new Date());
const loading = ref(false);
const manage = useManageStore();
const rows = ref<{}[]>([]);
const token = useTokenStore();
const dataStore = useDataStore();

const columns = [
  { key: "id_equipe" },
  { key: "libelle", label: "Nom de l'équipe" },
  { key: "nbr_agent", label: "Nombre d'agents" },
  { key: "nbr_imprimante", label: "Nombre d'imprimantes" },
  { key: "nbr_kit", label: "Nombre de kits" },
  { key: "actions", label: "Rapports" }, 
];

let data: any = [];

function getTodayDateYMD() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à partir de 0
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd HH:mm:ss");
};

const dateFormat = (date: Date):string =>{
  return format(date, "yyyy-MM-dd")
}

const loadTableData = async (date: string) => {
  dataStore.updateData({ date });
};

async function getInfo(date: string) {
  loading.value = true;
  try {
    const response = await manage.getStatTeam(token.getSiteId, date);

    // Récupérer toutes les équipes disponibles
    const allTeams = await manage.getAgentsByEquipe(token.getSiteId);
    
    // Préparer un tableau pour stocker les équipes mises à jour
    const updatedTeams = new Map<number, any>();

    if (response.length === 0) {
      // Lorsque la réponse est vide, préremplir toutes les équipes avec des valeurs à zéro
      data = Object.values(allTeams).map((e: any) => ({
        id_equipe: e.id_equipe,
        libelle: e.equipe_name,
        nbr_agent: 0,
        nbr_imprimante: 0,
        nbr_kit: 0,
      }));
    } else {
      // Lorsque la réponse contient des données, mettez à jour les équipes existantes
      const responseTeams = response.map((e: any) => ({
        id_equipe: e.id_equipe,
        libelle: e.libelle,
        nbr_agent: e.nbr_agent,
        nbr_imprimante: e.nbr_imprimante,
        nbr_kit: e.nbr_kit,
      }));

      responseTeams.forEach((team: any) => {
        updatedTeams.set(team.id_equipe, team);
      });

      // Ajoutez les équipes sans données et préremplissez-les avec des valeurs à zéro
      Object.values(allTeams).forEach((e: any) => {
        if (!updatedTeams.has(e.id_equipe)) {
          updatedTeams.set(e.id_equipe, {
            id_equipe: e.id_equipe,
            libelle: e.equipe_name,
            nbr_agent: 0,
            nbr_imprimante: 0,
            nbr_kit: 0,
          });
        }
      });

      data = Array.from(updatedTeams.values());
    }

    // Trier les équipes par ordre alphabétique basé sur 'libelle'
    data.sort((a: any, b: any) => a.libelle.localeCompare(b.libelle));

    rows.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}



watch(
  () => selectedDate.value,
  (newDate) => {
    const formattedDate = formatDate(newDate);
    getInfo(formattedDate);
    loadTableData(formattedDate);
  },
  { immediate: true } // Pour charger les données immédiatement lors du montage
);

function reidirection(id: any, id_equipe: any) {
  return navigateTo(`/${id}/${id_equipe}`);
}

onMounted(() => {
  const todayDate = new Date();

  const formattedDate = formatDate(todayDate);
  getInfo(dateFormat(todayDate)).then(() => {
    loadTableData(formattedDate);
  });
});

watch([selectedDate], () => {
  getInfo(formatDate);
});
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <div class="mb-5 flex">
      <h1>Enregistrement du</h1>
      <UButton
        icon="i-heroicons-calendar-days-20-solid"
        :label="format(selectedDate, 'd MMMM yyyy', { locale: fr })"
      />
    </div>
    <template #panel="{ close }">
      <DatePicker v-model="selectedDate" @close="close" />
    </template>
  </UPopover>
  <UCard :ui="{ body: { base: '' }, base: '' }">
    <!-- <div v-for="site in sites" :key="site.siteName"> -->
      <h2>{{ token.getLocalites }}</h2>
    <UTable
      :loading="loading"
      :rows="rows"
      :columns="columns"
      class="utable"
      :ui="{ td: { padding: 'py-1 px-1' }, base: 'min-w-[600px]' }"
    >
      <template #id_equipe-data="{ row }">
        <p class="hidden">{{ row.id_equipe }}</p>
      </template>
      <template #libelle-data="{ row }">
        <p class="custom-lowercase">{{ row.libelle }}</p>
      </template>
      <template #actions-data="{ row }">
        <UButton
          v-if="
            row.nombre_agent > 0 || row.nbr_imprimante > 0 || row.nbr_kit > 0
          "
          color="orange"
          variant="solid"
          @click="reidirection(row.id_equipe, token.getSiteId)"
        >
          Modifier
        </UButton>
        <UButton
          v-else
          color="primary"
          variant="solid"
          @click="reidirection(row.id_equipe, token.getSiteId)"
        >
          Ajouter
        </UButton>
      </template>
    </UTable>
    <!-- </div> -->
  </UCard>
</template>

<style scoped>
/* Vos styles existants ... */
</style>

<style scoped>
/* Styles globaux pour le tableau */
h1 {
  font-size: 1.5em;
  text-align: center;
  margin: 0 5px;
}
h2 {
  font-weight: bold;
}
.container-enregistrement {
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table-container {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 80%;
  margin: 10px auto;
}

.utable {
  width: 100%;
  border-collapse: collapse;
}

.utable th,
.utable td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.utable th {
  background-color: #f4f4f4;
}

.utable tr:nth-child(even) {
  background-color: #f9f9f9;
}

.add-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #45a049;
}
.action-link {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-link:hover {
  background-color: #45a049;
}

.custom-lowercase::first-letter {
  text-transform: capitalize;
}
.custom-lowercase {
  text-transform: lowercase;
}
</style>
