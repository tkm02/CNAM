<template>
  <v-container>
    <div class="table-container">
      <v-simple-table class="styled-table">
        <thead>
          <tr>
            <th class="header-region">REGION</th>
            <th class="header-site">SITE</th>
            <th class="header-activite">ACTIVITES</th>
            <th class="header-equipe">EQUIPES</th>
            <th
              v-for="date in dates"
              :key="date"
              class="header-date"
              :colspan="9"
            >
              {{ date }}
            </th>
          </tr>
          <tr>
            <th colspan="4"></th>
            <template v-for="date in dates" :key="date">
              <th class="header-nb-op">Nb OP</th>
              <th class="header-nb-kit">Nb KIT</th>
              <th class="header-nb-imp">Nb IMP</th>
              <th class="header-obj">Capacité Instalée</th>
              <th class="header-obj">Capacité Realisée</th>
              <th class="header-obj">Capacité Non Realisée</th>
              <th class="header-obj">Capacité Dépassée</th>
              <th class="header-obj">Tranche Horaire</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="region in filteredStats" :key="region.region">
            <tr
              v-for="(equipe, index) in region.equipes"
              :key="`${region.region}-${equipe.nom}-${index}`"
            >
              <td
                v-if="index === 0"
                :rowspan="region.equipes.length"
                class="region-cell"
              >
                {{ region.region.toUpperCase() }}
              </td>
              <td
                v-if="index === 0"
                :rowspan="region.equipes.length"
                class="site-cell"
              >
                {{ region.site_in_situ.toUpperCase() }}
              </td>
              <td
                v-if="index === 0"
                :rowspan="region.equipes.length"
                class="activite-cell"
              >
                {{ region.activite }}
              </td>
              <td class="team-cell">{{ equipe.nom }}</td>
              <template v-for="date in dates" :key="`${equipe.nom}-${date}`">
                <td>{{ getStatByDate(equipe.stats, date, "nb_op") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "nb_kit") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "nb_imp") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "cap_inst") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "cap_rea") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "cap_no_re") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "cap_dep") }}</td>
                <td
                  v-for="time in times"
                  :key="`${equipe.nom}-${date}-${time}`"
                >
                  {{ getStatByDateAndTime(equipe.stats, date, time) }}
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
    </div>
  </v-container>
  <v-container>
    <h1>Observation</h1>
    <div>
      <ul v-if="detaileq.length">
        <li v-for="item in detaileq" :key="item.equipement_id_fk">
          Commentaire : {{ item.commentaire }}
        </li>
      </ul>
    </div>
  </v-container>
  <div class="signature">
    <h3>Signature</h3>
    <div class="checkbox">
      <UCheckbox
        v-model="selected"
        name="equipe"
        label="Responsable EQUIPE: OKA"
      />
      <UCheckbox
        v-model="selected2"
        name="site"
        label="Responsable SITE : KASSE TAGBO"
      />
    </div>
  </div>
  <div class="export-button-container">
    <UButton @click="exportToExcel" color="primary" class="m-4"
      >Exporter en XLS</UButton
    >
    <UButton @click="exportToExcel" color="red">Exporter en pdf</UButton>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";

const selected = ref(true);
const selected2 = ref(true);

const dataStore = useDataStore();
const tokenStore = useTokenStore();
let detaileq = [];
let detailag = [];

const staticData = reactive({
  dates: [],
  stats: [],
});

const dates = computed(() => staticData.dates);
const times = computed(() => staticData.stats[0]?.times || []);
const filteredStats = computed(() => staticData.stats);

function getDate(id) {
  switch (id) {
    case 1:
      return "08H-17H";
      break;
    case 2:
      return "07H-14H";
      break;
    case 3:
      return "14H-21H";
      break;
    case 4:
      return "21H-07H";
      break;

    default:
      return "-";
      break;
  }
}

// Fonction pour mettre à jour les données
function updateData() {
  const newData = dataStore.collectedData;
  console.log(newData);

  staticData.dates = [newData.date?.split("-").reverse().join("/") || ""];
  staticData.stats = [
    {
      region: tokenStore.region,
      site_in_situ: tokenStore.localites,
      activite: newData.type_operation == 1 ? "ENROLEMENT" : "PRODUCTION",
      equipes: [
        {
          nom: "EQUIPE A",
          stats: {
            date: newData.date?.replace("-", "/") || "",
            nb_op: newData.nbr_agent,
            nb_kit: newData.nbr_kit,
            nb_imp: newData.nbr_Imp,
            cap_inst: newData.objectif,
            cap_rea: newData.realise,
            cap_no_re: Math.max(0, newData.objectif - newData.realise),
            cap_dep: Math.max(0, newData.realise - newData.objectif),
            horaires: {
              [getDate(newData.tranche_horaire_id)]: getDate(
                newData.tranche_horaire_id
              ),
            },
          },
        },
      ],
      times: [getDate(newData.tranche_horaire_id)],
    },
  ];
}

function getDetailsIssues() {
  detaileq = [...dataStore.collectedData.detaileq];
  detailag = [...dataStore.collectedData.detailag];
  console.log(detaileq);
}

// Fonction pour récupérer une statistique par date
function getStatByDate(stats, date, key) {
  return stats[key] ?? "--";
}

// Fonction pour récupérer une statistique par date et heure
function getStatByDateAndTime(stats, date, time) {
  return stats.horaires[time];
}

// Fonction pour exporter les données en fichier Excel
function exportToExcel() {
  // ... (le code de la fonction reste inchangé)
}

// Watcher pour mettre à jour les données quand dataStore.collectedData change
watch(() => dataStore.collectedData, updateData, { deep: true });

watch(
  () => dataStore.collectedData,
  (newData) => {
    getDetailsIssues();
  },
  { immediate: true }
);

// Initialisation des données au montage du composant
onMounted(() => {
  updateData();
  getDetailsIssues();
});
</script>

<style scoped>
.signature {
  width: 50%;
  margin: 0 20px;
}
.checkbox {
  display: flex;
  justify-content: space-between;
}
.table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Arial", sans-serif;
  text-align: center;
  font-size: 14px;
  flex: 1;
}

.styled-table th,
.styled-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.styled-table thead tr:first-child {
  background-color: #8b4513;
  color: #ffffff;
  font-weight: bold;
}

.styled-table .header-region,
.styled-table .header-site,
.styled-table .header-equipe,
.styled-table .header-activite {
  background-color: #8b4513;
  color: white;
  font-weight: bold;
}

.styled-table .header-date {
  background-color: #f4a460;
  color: #000;
  font-weight: bold;
  text-align: center;
}

.styled-table .header-nb-op,
.styled-table .header-nb-kit,
.styled-table .header-nb-imp,
.styled-table .header-time,
.header-obj {
  background-color: #add8e6;
  color: #000;
  font-weight: bold;
}

.styled-table .region-cell,
.styled-table .site-cell,
.styled-table .team-cell,
.styled-table .activite-cell {
  font-weight: bold;
  background-color: #f5f5f5;
}

.styled-table .header-time {
  border-right: 1px solid #ddd;
}

.export-button-container {
  margin: 10px 5px;
}

.styled-table .activite-cell {
  white-space: pre-line;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.filters > * {
  flex: 1;
  min-width: 200px;
}
</style>
