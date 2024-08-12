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
              <th class="header-obj">Obj</th>
              <th v-for="time in times" :key="time" class="header-time">
                {{ time }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="region in stats" :key="region.region">
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
              <td class="team-cell">{{ equipe.nom.toUpperCase() }}</td>
              <template v-for="date in dates" :key="`${equipe.nom}-${date}`">
                <td>{{ getStatByDate(equipe.stats, date, "nb_op") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "nb_kit") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "nb_imp") }}</td>
                <td>{{ getStatByDate(equipe.stats, date, "obj") }}</td>
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

      <div class="export-button-container">
        <UButton @click="exportToExcel" color="primary"
          >Exporter en XLS</UButton
        >
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx";
const dataStore = useDataStore();

interface Horaires {
  [key: string]: number;
}

interface Stat {
  date: string;
  nb_op: number;
  nb_kit: number;
  nb_imp: number;
  horaires: Horaires;
}

interface Equipe {
  nom: string;
  stats: Stat[];
}

interface Region {
  region: string;
  site_in_situ: string;
  activites: string;
  equipes: Equipe[];
}

const dates = ref<string[]>([]);
const times = ref<string[]>([]);
const stats = ref<Region[]>([]);
const route = useRoute();

async function getData() {
  const id = route.params.id_user;
  try {
    const response = await dataStore.getStatByUser(id);
    const formattedData = formatData(response);
    dates.value = formattedData.dates;
    times.value = formattedData.times;
    stats.value = formattedData.stats;
    console.log(id);
    
  } catch (error) {
    console.error(error);
  }
}

function formatHoraire(horaire: string) {
  if (!horaire || typeof horaire !== "string" || horaire.trim() === "") {
    return "--";
  }
  const [start, end] = horaire.split(" - ");
  if (!start || !end || start.length < 5 || end.length < 5) {
    return "--";
  }
  const startHour = start.slice(0, 2);
  const endHour = end.slice(0, 2);
  return `${startHour}h-${endHour}h`;
}

function formatData(apiResponse: any) {
  const datesSet = new Set<string>();
  const timesSet = new Set<string>();
  const stats: Region[] = [];

  // Fonction pour déterminer l'activité basée sur le type
  function getActivite(type: number): string {
    switch (type) {
      case 1:
        return "DISTRIBUTION";
      case 2:
        return "PRODCTION";
      case 3:
        return "ENROLEMENT";
      default:
        return "AUTRE";
    }
  }

  apiResponse.forEach((regionData: any) => {
    const regionStats: Region = {
      region: regionData.region,
      site_in_situ: regionData.localite,
      activite: "", // Nous allons le déterminer plus tard
      equipes: [],
    };

    const equipeStatsMap = new Map<string, Stat[]>();
    const activiteSet = new Set<string>();

    regionData.equipe.forEach((equipeData: any) => {
      const {
        equipe,
        date,
        nb_op,
        nb_kit,
        nbr_imp,
        horaire,
        type,
        objectif,
        realise,
      } = equipeData;
      const formattedDate = new Date(date).toLocaleDateString("fr-FR");
      datesSet.add(formattedDate);
      const formattedHoraire = formatHoraire(horaire);
      timesSet.add(formattedHoraire);

      const activite = getActivite(type);
      console.log(activite);
      activiteSet.add(activite);

      if (!equipeStatsMap.has(equipe)) {
        equipeStatsMap.set(equipe, []);
      }

      const existingStats = equipeStatsMap
        .get(equipe)
        ?.find((stat) => stat.date === formattedDate);
      if (existingStats) {
        existingStats.nb_op += parseInt(nb_op, 10);
        existingStats.nb_kit += parseInt(nb_kit, 10);
        existingStats.nb_imp += parseInt(nbr_imp, 10);
        existingStats.horaires[formattedHoraire] =
          existingStats.horaires[formattedHoraire] || 0;
      } else {
        equipeStatsMap.get(equipe)?.push({
          date: formattedDate,
          nb_op: parseInt(nb_op, 10),
          nb_kit: parseInt(nb_kit, 10),
          nb_imp: parseInt(nbr_imp, 10),
          obj: parseInt(objectif, 10),
          horaires: {
            [formattedHoraire]: realise,
          },
        });
      }
    });

    // Déterminer l'activité principale du site
    regionStats.activite = Array.from(activiteSet)[0] || "NON SPECIFIE";

    equipeStatsMap.forEach((stats, nom) => {
      regionStats.equipes.push({ nom, stats });
    });

    stats.push(regionStats);
  });

  return {
    dates: Array.from(datesSet),
    times: Array.from(timesSet),
    stats,
  };
}

const getStatByDate = (stats: Stat[], date: string, key: keyof Stat) => {
  const stat = stats.find((stat) => stat.date === date);
  return stat ? stat[key] : "-";
};

const getStatByDateAndTime = (stats: Stat[], date: string, time: string) => {
  const stat = stats.find((stat) => stat.date === date);
  return stat && stat.horaires[time] !== undefined ? stat.horaires[time] : "-";
};

function exportToExcel() {
  const worksheet = XLSX.utils.table_to_sheet(
    document.querySelector(".styled-table")
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "data.xlsx");
}

onMounted(() => {
  getData();
});
</script>
<style scoped>
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
  flex: 1; /* Permet au tableau de prendre tout l'espace disponible */
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
.styled-table .header-equipe {
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
.styled-table .team-cell {
  font-weight: bold;
  background-color: #f5f5f5;
}

.styled-table .header-time {
  border-right: 1px solid #ddd;
}

.export-button-container {
  margin-top: 16px; /* Ajoutez une marge pour séparer le bouton du tableau */
  text-align: center; /* Centrer le bouton horizontalement */
}
.styled-table .header-activite {
  background-color: #8b4513;
  color: white;
  font-weight: bold;
}

.styled-table .activite-cell {
  font-weight: bold;
  background-color: #f5f5f5;
  white-space: pre-wrap; /* Pour permettre le retour à la ligne si nécessaire */
}
.styled-table .activite-cell {
  /* ... autres styles ... */
  white-space: pre-line; /* Pour respecter les sauts de ligne */
}
</style>
