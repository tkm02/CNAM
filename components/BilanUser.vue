<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

definePageMeta({
  middleware: "auth",
});

const columns = [
  {
    key: "id_agent",
    label: "ID",
  },
  {
    key: "nom_agent",
    label: "Agent",
  },
  {
    key: "actions",
    label: "Enrôlements",
  },
];

const selected = ref<any>([]);
const rows = ref<any>([]);
const loading = ref(false);
const mainInputValue = ref(0);

const printerInputValuesArray = ref<number[]>([]);

const showModal = ref(false);
const modalReason = ref("");
const removedItem = ref<any>(null);

const manage = useManageStore();
const route = useRoute();
const dataStore = useDataStore();
const token = useTokenStore();
const tranche = ref<any>([]);
const previousSelection = ref([...selected.value]);
const text2 = "Veuillez saisir : ";
const text2Sub =
  "- soit le nombre total d'enrôlements de l'équipe, soit le nombre d'enrôlements faits par chaque agent.";
const text2Sub1 = "- la tranche horaire pendant laquelle l'équipe a travaillé.";

// Fonction appelée lors du changement de sélection
const handleSelectChange = (id: number) => {
  console.log(`ID sélectionné : ${id}`);
  dataStore.updateData({
    tranche_horaire_id: Number(id),
  });
};

function handleObjectifChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = parseFloat(input.value);

  if (!isNaN(value)) {
    dataStore.updateData({
      objectif: Number(value),
    });
  } else {
    console.error("Invalid input: Not a number");
  }
}

function formatTimeRange(startTime: any, endTime: any) {
  // Assurez-vous que les heures sont en format HH:mm
  const formatTime = (time: any) => {
    const [hours, minutes] = time.split(":");
    return `${hours}H`;
  };

  return `${formatTime(startTime)}-${formatTime(endTime)}`;
}

const selectedTimeRange = ref<any>(null);



const state = reactive({
  inpusel: undefined,
  motif: undefined,
  objectif: 0,
});

watch(
  selected,
  (newValue, oldValue) => {
    const removedItems = oldValue.filter(
      (item: any) => !newValue.includes(item)
    );
    if (removedItems.length > 0) {
      previousSelection.value = [...oldValue]; // Sauvegarder l'ancienne sélection
      removedItem.value = removedItems[0];
      showModal.value = true;
    }
  },
  { deep: true }
);

function closeModal(status = false) {
  showModal.value = false;
  modalReason.value = "";
  if (status == true) {
    selected.value = [...previousSelection.value];
  }
  // Restaurer l'ancienne sélection
}

function submitModal() {
  console.log("Reason submitted for item:", removedItem.value);
  console.log("Reason:", modalReason.value);
  if (selected.value.includes(removedItem.value)) {
    selected.value = selected.value.filter(
      (item: any) => item.id_agent !== removedItem.value.id_agent
    );
  }

  addAgentDetail(state.motif, removedItem.value.id_agent, state.inpusel);
  closeModal();
}

async function getData() {
  try {
    const response = await dataStore.indexTrancheHoraire();
    tranche.value = Object.values(response.data);

    console.log(tranche.value);
  } catch (error) {
    console.log(error);
  }
}

function resetTableInputs() {
  if (mainInputValue.value > 0) {
    printerInputValuesArray.value = printerInputValuesArray.value.map(() => 0);
  }
}

function updateMainInputValue() {
  mainInputValue.value = printerInputValuesArray.value.reduce(
    (acc, curr) => acc + curr,
    0
  );
}

const loadTableData = async (nbr_agent: any, realise: any, objectif: any) => {
  dataStore.updateData({
    nbr_agent: nbr_agent,
    realise: realise,
    site_id_fk: token.getDataInfo.valid_roles_and_sites[0].id_site,
    objectif: objectif,
  });
};

const addAgentDetail = (commentaire: any, agent_id_fk: any, id_pb: any) => {
  const newDetail = {
    commentaire: commentaire,
    agent_id_fk: agent_id_fk,
    type_probleme_id_fk: Number(id_pb),
  };
  dataStore.addDetailAg(newDetail);
};

// function addOperationDetail(agentName: string, nbrEnrolled: number) {
//   dataStore.addOperationDetail({ agentName, nbrEnrolled });
// }

function updateDetailOp() {
  const detailop = selected.value.map((agent: any, index: number) => ({
    agentName: agent.nom_agent,
    nbrEnrolled: printerInputValuesArray.value[index] || 0,
    id_agent: agent.id_agent,  // Add the agent ID here
  }));
  dataStore.updateData({ detailop });
  console.log("Updated detailop:", detailop);
}


watch(
  () => printerInputValuesArray.value,
  () => {
    updateDetailOp();
  },
  { deep: true }
);

watch(
  () => mainInputValue.value,
  () => {
    loadTableData(rows.value.length, mainInputValue.value, state.objectif);
  }
);

async function getDataAgent() {
  loading.value = true;
  const id = route.params.id_equipe;
  console.log(id);
  //console.log(token.getDataInfo.valid_roles_and_sites[0].id_site);

  try {
    const response = await manage.getAgentsByEquipe(
      token.getDataInfo.valid_roles_and_sites[0].id_site
    );
    console.log(response,'----------------');

    rows.value = Object.values(response);

    selected.value = rows.value;
    printerInputValuesArray.value = rows.value.map(() => 0);
    dataStore.updateData({ objectif: token.getObjectif });
    state.objectif = token.getObjectif; // Initialiser les valeurs de saisie à 0
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getData();
  getDataAgent().then(() => {
    loadTableData(rows.value.length, mainInputValue.value, state.inpusel);
    dataStore.updateData({ objectif: token.getObjectif });
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
        label:
          formatTimeRange(range.heure_debut, range.heure_fin),
        value: range.id,
      }))
        "
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
          <!-- {{
            getTimeRangeLabelById(selectedTimeRange) !== null
              ? "de " + getTimeRangeLabelById(selectedTimeRange)
              : ""
          }} -->
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
            Pour quelle raison cet agent n'était pas au travail ?
          </h3>
        </template>
        <div class="mt-2">
          <UForm :state="state">
            <UFormGroup>
              <USelect
                placeholder="Motif de retrait"
                color="primary"
                variant="outline"
                :options="[
                  { name: 'Maladie', value: 1 },
                  { name: 'Congés', value: 2 },
                  { name: 'Autre', value: 3 },
                ]"
                v-model="state.inpusel"
                option-attribute="name"
              />
            </UFormGroup>
            <UFormGroup>
              <UTextarea
                v-model="state.motif"
                type="text"
                placeholder="Commentaire"
                class="mt-2 w-full border border-gray-300 rounded-md"
              />
            </UFormGroup>
          </UForm>
          <div class="mt-4 flex justify-end space-x-2">
            <UButton color="gray" label="Annuler" @click="closeModal(true)" />
            <UButton color="blue" label="Confirmer" @click="submitModal()" />
          </div>
        </div>
        <template #footer> </template>
      </UCard>
    </UModal>
  </div>
</template>
