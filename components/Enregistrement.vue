<script setup lang="ts">
import { ref, computed } from "vue";
import DatePicker from "./DatePicker.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useManageStore } from "~/stores/manageStore";

const props = defineProps(["typeOperation"]);

const selectedDate = ref(new Date());
const loading = ref(false);
const manage = useManageStore();
const route = useRoute();
const rows = ref<{}[]>([]);
const token = useTokenStore();
const dataStore = useDataStore();

const columns = [
  // {key: "id_equipe"},
  { key: "libelle" },
  { key: "nbr_agent", label: "Agents" },
  { key: "nbr_imprimante", label: "Imprimantes" },
  { key: "nbr_kit", label: "Kits" },
  { key: "objectif", label: "Capacité installée" },
  { key: "realise", label: "Enrôlements", class: "bg-blue-500/50 text-white" },
  { key: "type_operation" },
  { key: "id_equipe" },
  { key: "actions", label: "Rapports" },
];

let data: any = [];

const formatDate = (date: Date, symbol: any, reverse = false): string => {
  if (reverse) {
    return format(date, `dd${symbol}MM${symbol}yyyy`);
  }
  return format(date, `yyyy${symbol}MM${symbol}dd`);
};

function formatEquipeName(equipe: string): string {
  return equipe
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Ajoute un espace entre une lettre minuscule suivie d'une majuscule
    .toLowerCase() // Transforme tout en minuscules
    .replace(/\b\w/g, (letter) => letter.toUpperCase()); // Met en majuscule la première lettre de chaque mot
}

const dateFormat = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

const loadTableData = async (date: string) => {
  dataStore.updateData({ date });
};

async function getInfo(date: string) {
  loading.value = true;
  try {
    console.log(token.getDataInfo);

    let response;

    if (token.getDataInfo.valid_roles_and_sites[0].role_id == 2) {
      response = await manage.getStatTeam(
        token.getDataInfo.valid_roles_and_sites[0].id_site,
        date
      );
    } else {
      response = await manage.getRecapEquipe(
        token.getDataInfo.valid_roles_and_sites[0].equipe_id,
        date
      );
    }

    console.log("recap : " + response);

    let allTeams = token.getDataInfo.valid_roles_and_sites;
    const role = token.getDataInfo.valid_roles_and_sites[0].role_id;

    if (role === 2) {
      const teamsResponse = await manage.getTeamBySite();

      console.log(teamsResponse);

      if (teamsResponse) {
        allTeams = teamsResponse;
      }

      allTeams = allTeams.filter(
        (team: any) => team.type_operation_id_fk === Number(props.typeOperation)
      );
    } else if (role === 3) {
      allTeams = [token.getDataInfo.valid_roles_and_sites[0]];
    }

    // Fonction pour créer un objet avec des valeurs par défaut
    const createDefaultTeam = (team: any, collectedData: any) => {
      return {
        id_equipe: team.id_equipe || team.equipe_id,
        libelle: team.nom_equipe,
        nbr_agent: 0,
        nbr_imprimante: 0,
        nbr_kit: 0,
        type_operation: 0,
        realise: {
          value: 0,
          class: "bg-blue-500/50 text-white",
        },
        objectif: 0,
        status:0
      };
    };

    let data: any[] = [];

    if (response.length === 0) {
      // Utiliser les données de collectedData pour chaque équipe filtrée
      data = allTeams.map((team: any) =>
        createDefaultTeam(team, dataStore.collectedData)
      );
    } else {
      let filteredResponse = response.filter(
        (e: any) => Number(e.type_operation) === Number(props.typeOperation)
      );

      const updatedTeams = new Map<number, any>();

      if (role === 3) {
        // Filtrer pour ne garder que l'équipe que l'utilisateur dirige
        const userTeamId = token.getDataInfo.valid_roles_and_sites[0].equipe_id;
        filteredResponse = filteredResponse.filter(
          (e: any) => Number(e.id_equipe) === Number(userTeamId)
        );
      }

      // Mettre à jour updatedTeams avec les données filtrées
      filteredResponse.forEach((e: any) => {
        updatedTeams.set(Number(e.id_equipe) || Number(e.equipe_id), {
          id_equipe: e.id_equipe,
          libelle: e.nom_equipe || e.libelle,
          nbr_agent: e.nbr_agent,
          nbr_imprimante: e.nbr_imprimante,
          nbr_kit: e.nbr_kit,
          type_operation: e.type_operation,
          realise: { value: e.realise, class: "bg-blue-500/50 text-white" },
          objectif: e.objectif || e.capacite,
          status:e.status
        });
      });

      allTeams.forEach((team: any) => {
        const teamIdKey = team.id_equipe || team.equipe_id;
        if (!updatedTeams.has(teamIdKey)) {
          updatedTeams.set(
            teamIdKey,
            createDefaultTeam(team, dataStore.collectedData)
          );
        }
      });

      data = Array.from(updatedTeams.values());
    }

    data.sort((a: any, b: any) => a.libelle.localeCompare(b.libelle));
    console.log(data);

    rows.value = data;

    console.log("rows " + JSON.stringify(rows.value));
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => selectedDate.value,
  (newDate) => {
    const formattedDate = formatDate(newDate, "-");
    getInfo(formattedDate);
    loadTableData(formattedDate);
  },
  { immediate: true } // Pour charger les données immédiatement lors du montage
);

function reidirection(nom_equipe: any, id_equipe: any, type_op: any) {
  return navigateTo(`/${nom_equipe}/${id_equipe}/${type_op}`);
}

onMounted(() => {
  const todayDate = new Date();
  console.log("id" + props.typeOperation);

  const formattedDate = formatDate(todayDate, "-");
  getInfo(dateFormat(todayDate)).then(() => {
    loadTableData(formattedDate);
  });
  token.setDateSelected(formatDate(todayDate, "/", true));
});

watch([selectedDate], () => {
  getInfo(dateFormat(selectedDate.value));
  token.setDateSelected(formatDate(selectedDate.value, "/", true));
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
  <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: '' }">
    <!-- <div v-for="site in sites" :key="site.siteName"> -->
    <!-- <h2>{{ token.getLocalites }}</h2> -->
    <UTable
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Aucune donnée disponible.',
      }"
      :loading="loading"
      :rows="rows"
      :columns="columns"
      class="utable"
      :ui="{
        td: { padding: 'py-1 px-1', base: 'text-center' },
        base: 'min-w-[600px]',
        th: { base: 'text-center' },
      }"
    >
      <template #id_equipe-data="{ row }">
        <p class="hidden">{{ row.id_equipe }}</p>
      </template>
      <template #libelle-data="{ row }">
        <p class="">{{ formatEquipeName(row.libelle) }}</p>
      </template>
      <template #type_operation-data="{ row }">
        <p class="hidden">{{ row.type_operation }}</p>
      </template>
      <template #realise-data="{ row }">
        {{ row.realise.value }}
      </template>
      <template #actions-data="{ row }">
        <div
          class="flex space-x-2"
          v-if="token.getDataInfo.valid_roles_and_sites[0].role_id === 3"
        >
          <UButton
            :label="
              row.nombre_agent > 0 || row.nbr_imprimante > 0 || row.nbr_kit > 0
                ? 'Modifier'
                : 'Ajouter'
            "
            @click="
              reidirection(
                row.libelle.replace(' ', '_'),
                row.id_equipe,
                props.typeOperation
              )
            "
            :icon="
              row.nombre_agent > 0 || row.nbr_imprimante > 0 || row.nbr_kit > 0
                ? 'i-heroicons-pencil'
                : 'i-heroicons-plus'
            "
            :color="
              row.nombre_agent > 0 || row.nbr_imprimante > 0 || row.nbr_kit > 0
                ? 'orange'
                : 'primary'
            "
          />
          <UButton
            icon="i-heroicons-pencil"
            label="Editer le pv"
            color="orange"
            @click="
              reidirection(
                row.libelle.replace(' ', '_'),
                row.id_equipe,
                props.typeOperation
              )
            "
          />
        </div>
        <div v-else>
          <!-- {{ row.id_equipe }} -->
          <UButton
            label="valider le pv"
            :disabled="Number(row.status) === 1"
            @click="
              reidirection(
                row.libelle.replace(' ', '_'),
                row.id_equipe,
                props.typeOperation
              )
            "
          />
        </div>
        <!-- <UButton
          v-if="
            row.nombre_agent > 0 || row.nbr_imprimante > 0 || row.nbr_kit > 0
          "
          color="orange"
          variant="solid"
          @click="reidirection(row.id_equipe, token.getSiteId)"
        >
          {{ row.label }}
        </UButton> -->
        <!-- <UButton
          v-else
          color="primary"
          variant="solid"
          @click="reidirection(row.id_equipe, token.getSiteId)"
        >
          Ajouter
        </UButton> -->
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
