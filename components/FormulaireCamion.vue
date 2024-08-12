<script setup lang="ts">
import { ref, watch } from 'vue';
import { format, addDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données pour la localité avec autocomplétion
const localites = [
  'Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro', 'Daloa', 'Grand-Bassam', 
  'Jacqueville', 'Dabou', 'Alépé', 'Bingerville', 'Songon', 'Bonoua',
  'Sassandra', 'Tabou', 'Soubré', 'Séguéla', 'Mankono', 'Kani', 'Odienné',
  'Minignan', 'Bondoukou', 'Bouna', 'Tanda', 'Man', 'Danané', 'Duékoué',
  'Bangolo', 'Guiglo', 'Toulepleu', 'Bloléquin', 'Katiola', 'Béoumi', 
  'Dabakala', 'Korhogo', 'Ferkessédougou', 'Ouangolodougou', 'Boundiali', 
  'Tingréla', 'Gagnoa', 'Oumé', 'Divo', 'Lakota', 'Toumodi', 'Djékanou',
  'Tiébissou', 'Abengourou', 'Agnibilékrou', 'Adzopé', 'Aboisso', 'Tiapoum',
  'Vavoua', 'Issia', 'Zoukougbeu', 'Dimbokro', 'Daoukro', 'Bocanda', 'Bouaflé',
  'Sinfra', 'Zuénoula', 'Touba', 'Koro', 'Ouaninou', 'Sakassou', 'Botro',
  'Sinématiali', 'Dikodougou', 'M’bengué', 'Niakaramandougou', 'Bettié',
  'Guiglo', 'Toulepleu', 'Bloléquin', 'Bangolo', 'Kouibly', 'Bocanda', 
  'Kouassi-Kouassikro', 'Bongouanou', 'Arrah', 'M’Batto', 'Grand-Béréby',
  'Akoupé', 'Afféry', 'Agboville', 'Tiassalé', 'Taabo', 'Sikensi', 'Kong',
  'Mankono', 'Kounahiri', 'Doropo', 'Nassian', 'Sandégué', 'Toumodi',
  'Tiébissou', 'Djékanou', 'Dabou', 'Jacqueville', 'Grand-Bassam', 'Bonoua'
];

const selectedLocalite = ref('');

// Valeurs du formulaire
const camion = ref('');
const lieu = ref('');
const objectif = ref('');
const intitule = ref('');
const dateDebut = ref(new Date());
const dateFin = ref(addDays(new Date(), 7));

// Fonction pour contrôler la date de fin
const updateDateFin = () => {
  if (isAfter(dateDebut.value, dateFin.value)) {
    dateFin.value = addDays(dateDebut.value, 1);
  }
};

// Observer les changements de dateDebut
watch(dateDebut, updateDateFin);

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
  // Logique pour envoyer les données du formulaire à votre API
};
</script>

<template>
  <div class="form-container">
    <h1>Formulaire d'enregistrement</h1>

    <div class="form-grid">
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
      <div class="form-group full-width">
        <label for="intitule">Intitulé:</label>
        <UInput v-model="intitule" id="intitule" placeholder="Entrez l'intitulé" />
      </div>

      <!-- Conteneur pour les sélecteurs de date sur la même ligne -->
      <div class="form-group date-group full-width dates">
        <!-- Sélecteur de date de début -->
        <div class="date-item">
          <label for="dateDebut">Date de début:</label>
          <UPopover :popper="{ placement: 'bottom-start' }" class="btn-date">
            <UButton icon="i-heroicons-calendar-days-20-solid" class="btn-date-content">
              {{ format(dateDebut, 'd MMMM yyyy', { locale: fr }) }}
            </UButton>
            <template #panel="{ close }">
              <DatePicker v-model="dateDebut" :locale="fr" @close="close" />
            </template>
          </UPopover>
        </div>

        <!-- Sélecteur de date de fin -->
        <div class="date-item">
          <label for="dateFin">Date de fin:</label>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" class="btn-date-content" >
              {{ format(dateFin, 'd MMMM yyyy', { locale: fr }) }}
            </UButton>
            <template #panel="{ close }">
              <DatePicker v-model="dateFin" :locale="fr" :min-date="dateDebut" @close="close" class="bg-white" />
            </template>
          </UPopover>
        </div>
      </div>

    </div>
    </div>

  </template>
 
<style scoped>

.btn-date-content{
    width: 100%;
}
.form-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  /* border: 1px solid; */
}

.dates{
    flex-direction: row;
    /* border: 1px solid; */
    justify-content: space-between;

}
.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.full-width {
  grid-column: span 2;
}

/* Style pour le groupe de date */
.date-group {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.date-item {
  flex: 1;
}

.form-group input,
.form-group button {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group button {
  cursor: pointer;
}
</style>
