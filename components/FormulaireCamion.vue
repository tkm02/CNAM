<script setup lang="ts">
import { ref } from 'vue';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données pour la localité avec autocomplétion
const localites = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro', 'Daloa'];
const selectedLocalite = ref('');

// Valeurs du formulaire
const camion = ref('');
const lieu = ref('');
const objectif = ref('');
const intitule = ref('');
const dateDebut = ref(new Date());
const dateFin = ref(addDays(new Date(), 7)); // Initialisation de dateFin avec une semaine après dateDebut

// Fonction pour soumettre le formulaire
const submitForm = () => {
  const formData = {
    camion: camion.value,
    localite: selectedLocalite.value,
    lieu: lieu.value,
    objectif: objectif.value,
    intitule: intitule.value,
    dateDebut: format(dateDebut.value, 'yyyy-MM-dd'),
    dateFin: format(dateFin.value, 'yyyy-MM-dd')
  };
  console.log('Form data:', formData);
  // Vous pouvez ajouter ici la logique pour envoyer les données du formulaire à votre API
};
</script>
<template>
    <div class="form-container">
      <h1>Formulaire d'enregistrement</h1>
  
      <!-- Champ pour le camion -->
      <div class="form-group">
        <label for="camion">Camion:</label>
        <UInput v-model="camion" id="camion" placeholder="Entrez le numéro du camion" />
      </div>
  
      <!-- Champ pour la localité avec autocomplétion -->
      <div class="form-group">
        <label for="localite">Localité:</label>
        <UInputMenu v-model="selectedLocalite" :options="localites" id="localite" />
      </div>
  
      <!-- Champ pour le lieu -->
      <div class="form-group">
        <label for="lieu">Lieu:</label>
        <UInput v-model="lieu" id="lieu" placeholder="Entrez le lieu" />
      </div>
  
      <!-- Champ pour l'objectif -->
      <div class="form-group">
        <label for="objectif">Objectif:</label>
        <UInput v-model="objectif" id="objectif" placeholder="Entrez l'objectif" />
      </div>
  
      <!-- Champ pour l'intitulé -->
      <div class="form-group">
        <label for="intitule">Intitulé:</label>
        <UInput v-model="intitule" id="intitule" placeholder="Entrez l'intitulé" />
      </div>
  
      <!-- Sélecteur de date de début -->
      <div class="form-group">
        <label for="dateDebut">Date de début:</label>
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton icon="i-heroicons-calendar-days-20-solid">
            {{ format(dateDebut, 'd MMMM yyyy', { locale: fr }) }}
          </UButton>
  
          <template #panel="{ close }">
            <DatePicker v-model="dateDebut" :locale="fr" @close="close" />
          </template>
        </UPopover>
      </div>
  
      <!-- Sélecteur de date de fin -->
      <div class="form-group">
        <label for="dateFin">Date de fin:</label>
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton icon="i-heroicons-calendar-days-20-solid">
            {{ format(dateFin, 'd MMMM yyyy', { locale: fr }) }}
          </UButton>
  
          <template #panel="{ close }">
            <DatePicker v-model="dateFin" :locale="fr" @close="close" />
          </template>
        </UPopover>
      </div>
  
      <!-- Bouton de soumission -->
      <div class="form-group">
        <UButton @click="submitForm" color="primary">Soumettre</UButton>
      </div>
    </div>
  </template>

<style scoped>
.form-container {
  width: 80%;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
  