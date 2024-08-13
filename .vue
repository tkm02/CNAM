<!-- <template>
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
          <UTable :rows="people" />
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
  import { ref, computed } from "vue";
  import * as XLSX from "xlsx";
  const selected = ref(true)
  const selected2 = ref(true)
  
  const dataStore = useDataStore();
  const tokenStore = useTokenStore();
  // Données statiques fournies
  const staticData = reactive({
    dates: [dataStore.collectedData.date.replace("-", "/")],
    stats: [
      {
        region: tokenStore.region,
        site_in_situ: tokenStore.localites,
        activite:
          dataStore.collectedData.type_operation == 1
            ? "ENROLEMENT"
            : "PRODUCTION",
        equipes: [
          {
            nom: "EQUIPE A",
            stats: {
              date: dataStore.collectedData.date.replace("-", "/"),
              nb_op: dataStore.collectedData.nbr_agent,
              nb_kit: dataStore.collectedData.nbr_kit,
              nb_imp: dataStore.collectedData.nbr_Imp,
              cap_inst: dataStore.collectedData.objectif,
              cap_rea: dataStore.collectedData.realise,
              cap_no_re:
                dataStore.collectedData.objectif -
                  dataStore.collectedData.realise <
                0
                  ? dataStore.collectedData.objectif -
                    dataStore.collectedData.realise
                  : 0,
              cap_dep:
                dataStore.collectedData.realise -
                  dataStore.collectedData.objectif >
                0
                  ? dataStore.collectedData.realise -
                    dataStore.collectedData.objectif
                  : 0,
              horaires: {
                "08h-17h": 38,
              },
            },
          },
        ],
        times: ["08h-17h"],
      },
    ],
  });
  console.log(staticData);
  
  
  const dates = ref(staticData.dates);
  const times = ref(staticData.stats[0].times);
  const filteredStats = ref(staticData.stats);
  
  // Filtres sélectionnés
  const selectedRegion = ref("");
  const selectedSite = ref("");
  const selectedEquipe = ref("");
  
  // Calcul des régions uniques pour le filtre
  const uniqueRegions = computed(() => {
    return Array.from(new Set(staticData.stats.map((stat) => stat.region)));
  });
  
  // Calcul des sites uniques pour le filtre
  const uniqueSites = computed(() => {
    return Array.from(new Set(staticData.stats.map((stat) => stat.site_in_situ)));
  });
  
  // Calcul des équipes uniques pour le filtre
  const uniqueEquipes = computed(() => {
    const equipes = staticData.stats.flatMap((stat) =>
      stat.equipes.map((equipe) => equipe.nom)
    );
    return Array.from(new Set(equipes));
  });
  
  // Fonction pour récupérer une statistique par date
  function getStatByDate(stats, date, key) {
    const value = stats.date === date ? stats[key] : "--";
    return value === 0 ? "--" : value;
  }
  
  // Fonction pour récupérer une statistique par date et heure
  function getStatByDateAndTime(stats, date, time) {
    return stats.date === date ? stats.horaires[time] || "--" : "--";
  }
  
  // Fonction pour exporter les données en fichier Excel
  function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      [
        "Région",
        "Site",
        "Activité",
        "Équipe",
        ...dates.value.flatMap((date) => [
          `${date} Nb OP`,
          `${date} Nb KIT`,
          `${date} Nb IMP`,
          `${date} Capacité Installée`,
          `${date} Capacité Réalisée`,
          `${date} Capacité Non Réalisée`,
          `${date} Capacité Dépassée`,
          ...times.value.map((time) => `${date} ${time}`),
        ]),
      ],
    ];
  
    filteredStats.value.forEach((region) => {
      region.equipes.forEach((equipe) => {
        const row = [
          region.region.toUpperCase(),
          region.site_in_situ.toUpperCase(),
          region.activite,
          equipe.nom,
          getStatByDate(equipe.stats, dates.value[0], "nb_op"),
          getStatByDate(equipe.stats, dates.value[0], "nb_kit"),
          getStatByDate(equipe.stats, dates.value[0], "nb_imp"),
          getStatByDate(equipe.stats, dates.value[0], "objectif"),
          getStatByDate(equipe.stats, dates.value[0], "realise"),
          getStatByDate(equipe.stats, dates.value[0], "cap_no_re"),
          getStatByDate(equipe.stats, dates.value[0], "cap_dep"),
          ...times.value.map((time) =>
            getStatByDateAndTime(equipe.stats, dates.value[0], time)
          ),
        ];
        worksheetData.push(row);
      });
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stats");
    XLSX.writeFile(workbook, "Stats.xlsx");
  }
  
  </script>
  
  <style scoped>
  .signature{
    width: 50%;
    margin: 0 20px;
  }
  .checkbox{
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
   -->