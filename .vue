
<script setup lang="ts">
import { ref, watch, onMounted, reactive } from "vue";

definePageMeta({
  middleware: "auth",
});

const columns = [
  { key: "id_agent", label: "ID" },
  { key: "nom_agent", label: "Agent" },
  { key: "actions", label: "Enrôlements" },
];

const selected = ref<any>([]);
const rows = ref<any>([]);
const loading = ref(false);
const mainInputValue = ref(0);
const printerInputValuesArray = ref<number[]>([]);
const showModal = ref(false);
const modalReason = ref("");
const removedItem = ref<any>(null);
const tranche = ref<any>([]);
const state = reactive({ inpusel: undefined, motif: undefined, objectif: 0 });

const manage = useManageStore();
const route = useRoute();
const dataStore = useDataStore();
const token = useTokenStore();
const selectedTimeRange = ref<any>(null);

watch(selected, (newValue, oldValue) => {
  const removedItems = oldValue.filter((item: any) => !newValue.includes(item));
  if (removedItems.length > 0) {
    removedItem.value = removedItems[0];
    showModal.value = true;
  }
}, { deep: true });

watch(printerInputValuesArray, () => {
  updateDetailOp();
  updateMainInputValue();  // Met à jour la valeur totale des enrôlements
}, { deep: true });

watch(() => mainInputValue.value, () => {
  loadTableData(rows.value.length, mainInputValue.value, state.objectif);
});

function addOperationDetail(agentName: string, nbrEnrolled: number) {
  dataStore.addOperationDetail({ agentName, nbrEnrolled });
}

function updateDetailOp() {
  dataStore.updateData({
    detailop: selected.value.map((agent: any, index: number) => ({
      agentName: agent.nom_agent,
      nbrEnrolled: printerInputValuesArray.value[index] || 0,
    })),
  });
}

// Fonction pour mettre à jour la valeur totale des enrôlements
function updateMainInputValue() {
  mainInputValue.value = printerInputValuesArray.value.reduce((sum, value) => sum + value, 0);
}

function handleSelectChange(id: number) {
  dataStore.updateData({ tranche_horaire_id: Number(id) });
}

function handleObjectifChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = parseFloat(input.value);

  if (!isNaN(value)) {
    dataStore.updateData({ objectif: Number(value) });
  }
}

async function getData() {
  try {
    const response = await dataStore.indexTrancheHoraire();
    tranche.value = Object.values(response.data);
  } catch (error) {
    console.log(error);
  }
}

function resetTableInputs() {
  if (mainInputValue.value > 0) {
    printerInputValuesArray.value = printerInputValuesArray.value.map(() => 0);
    updateMainInputValue();  // Mettre à jour mainInputValue après la réinitialisation
  }
}

async function getDataAgent() {
  loading.value = true;
  try {
    const response = await manage.getAgentsByEquipe(token.getDataInfo.valid_roles_and_sites[0].id_site);
    rows.value = Object.values(response);
    selected.value = rows.value;
    printerInputValuesArray.value = rows.value.map(() => 0);
    dataStore.updateData({ objectif: token.getObjectif });
    state.objectif = token.getObjectif;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function closeModal(status = false) {
  showModal.value = false;
  modalReason.value = "";
  if (status == true) {
    selected.value.push(removedItem.value);
  }
}

function submitModal() {
  selected.value = selected.value.filter((item: any) => item.id_agent !== removedItem.value.id_agent);
  addAgentDetail(state.motif, removedItem.value.id_agent, state.inpusel);
  closeModal();
}

onMounted(() => {
  getData();
  getDataAgent().then(() => {
    loadTableData(rows.value.length, mainInputValue.value, state.inpusel);
  });
});
</script>


<template>
  <div>
    <p class="text-xs font-thin italic text-gray-500">
      *
      {{ text2 }}
    </p>
    <div class="px-4 mt-0 pt-0">
      <p class="text-xs italic text-orange-500 font-bold">
        {{ text2Sub }} <br />
        {{ text2Sub1 }}
      </p>
    </div>
  </div>

  <UCard :ui="{ ring: 'ring-blue-500' }">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 2xl:gap-64">
      <div>
        <p class="font-bold text-sm">Nombre total d'enrôlements</p>
        <UInput
          v-model="mainInputValue"
          type="number"
          @input="resetTableInputs"
        />
      </div>
      <div>
        <p class="font-bold text-sm">Tranche horaire</p>
        <USelect
          v-model="selectedTimeRange"
          :options="tranche.map((range: any) => ({
            label: formatTimeRange(range.heure_debut, range.heure_fin),
            value: range.id,
          }))"
          @change="handleSelectChange"
        />
      </div>
      <div>
        <p class="font-bold text-sm">Capacité installée</p>
        <UInput
          type="number"
          v-model="state.objectif"
          @input="handleObjectifChange"
          disabled
          color="gray"
          variant="outline"
        />
      </div>
    </div>
  </UCard>

  <div class="grid grid-cols-1">
    <div>
      <div>
        <p class="mb-3">
          Liste des agents de l'équipe
        </p>
        <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' } }">
          <UTable
            :empty-state="{
              icon: 'i-heroicons-circle-stack-20-solid',
              label: 'Aucune donnée disponible.',
            }"
            v-model="selected"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :ui="{
              td: { padding: 'py-1 px-2' },
              base: 'text-start',
              th: { base: 'text-center' },
            }"
          >
            <template #actions-data="{ row, index }">
              <div class="w-full flex justify-center items-center">
                <UInput
                  type="number"
                  v-model="printerInputValuesArray[index]"
                  class="w-[70px]"
                  @change="updateMainInputValue"
                />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
    </div>

    <!-- Modal pour la confirmation de suppression -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            Pour quelle raison supprimez-vous cet agent?
          </h3>
        </template>
        <template #body>
          <UInput
            v-model="modalReason.value"
            placeholder="Entrez la raison ici..."
          />
        </template>
        <template #footer>
          <div class="flex gap-2">
            <UButton @click="closeModal(true)" ui="text" color="error">Annuler</UButton>
            <UButton @click="submitModal()" ui="text" color="primary">Confirmer</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>

  
</template>
