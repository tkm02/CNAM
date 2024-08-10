<script setup lang="ts">
import { ref, computed } from 'vue';
import data from '../data.json';
import DatePicker from './DatePicker.vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const selectedDate = ref(new Date());

const columns = [
  { key: 'nom', label: 'Nom de l\'équipe' },
  { key: 'agents', label: 'Nombre d\'agents' },
  { key: 'imprimantes', label: 'Nombre d\'imprimantes' },
  { key: 'kits', label: 'Nombre de kits' },
  { key: 'actions', label: 'Actions' }
];

const sites = computed(() => data.responsables.map(responsable => {
  const site = responsable.site;
  return {
    responsable: responsable.nom,
    siteName: site.nom,
    equipes: site.equipes.map(equipe => ({
      id: equipe.id,
      nom: equipe.nom,
      agents: equipe.agents.length,
      imprimantes: site.equipements.find(e => e.type === 'Imprimante')?.quantite || 0,
      kits: site.equipements.find(e => e.type === 'Kit')?.quantite || 0,
      hasData: equipe.agents.length > 0 || site.equipements.some(e => e.quantite > 0)
    }))
  };
}));

const addItem = (teamName: string, siteName: string) => {
  alert(`Ajouter un élément pour l'équipe ${teamName} sur le site ${siteName}`);
};

const modifyItem = (teamName: string, siteName: string) => {
  alert(`Modifier un élément pour l'équipe ${teamName} sur le site ${siteName}`);
};

</script>

<template>
  <div class="container-enregistrement">
    <UPopover :popper="{ placement: 'bottom-start' }">
      <h1>Enregistrement du</h1>
      <UButton
        icon="i-heroicons-calendar-days-20-solid"
        :label="format(selectedDate, 'd MMMM yyyy', { locale: fr })"
      />
      <template #panel="{ close }">
        <DatePicker v-model="selectedDate" @close="close" />
      </template>
    </UPopover>

    <div v-for="site in sites" :key="site.siteName" class="table-container">
      <h2>{{ site.siteName }}</h2>
      <UTable 
        :rows="site.equipes" 
        :columns="columns" 
        class="utable"
      >
        <template #actions-data="{ row }">
          <UButton
            v-if="row.hasData"
            color="green"
            variant="soft"
            @click="modifyItem(row.nom, site.siteName)"
          >
            Modifier
          </UButton>
          <UButton
            v-else
            color="green"
            variant="soft"
            @click="addItem(row.nom, site.siteName)"
          >
            Ajouter
          </UButton>
        </template>
      </UTable>
    </div>

    <FormulaireCamion/>
  </div>
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
    width: 50%;
    margin: 10px auto;
  }
  
  .utable {
    width: 100%;
    border-collapse: collapse;
  }
  
  .utable th, .utable td {
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
    background-color: #4CAF50;
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
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-link:hover {
  background-color: #45a049;
}
  </style>
  
