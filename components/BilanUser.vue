<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

definePageMeta({
  middleware: "guest",
});

const columns = [
  {
    key: "id_agent",
    label: "ID",
  },
  {
    key: "nom_agent",
    label: "Nom de l'agent",
  },
  {
    key: "actions",
    label: "Nombre de personnes enrollées",
  },
];

const rawData = [
  {
    id: 5,
    libelle: "team1",
    heure_debut: "2024-08-01 08:00:00",
    heure_fin: "2024-08-09 17:00:00",
  },
  {
    id: 6,
    libelle: "team2",
    heure_debut: "2024-08-01 07:00:00",
    heure_fin: "2024-08-09 14:00:00",
  },
  {
    id: 7,
    libelle: "team3",
    heure_debut: "2024-08-01 14:00:00",
    heure_fin: "2024-08-09 21:00:00",
  },
  {
    id: 8,
    libelle: "team4",
    heure_debut: "2024-08-01 21:00:00",
    heure_fin: "2024-08-10 07:00:00",
  },
];

const selected = ref<any>([]);
const rows = ref<any>([]);
const loading = ref(false);
const mainInputValue = ref(0);

const printerInputValuesArray = ref<number[]>([]);

const showModal = ref(false);
const modalReason = ref("");
const removedItem = ref(null);

const manage = useManageStore();
const route = useRoute();
const status = ref(false);

const handleUpdateStatus = () => {
  status.value = true;
};

watch(
  selected,
  (newValue, oldValue) => {
    const removedItems = oldValue.filter(
      (item: any) => !newValue.includes(item)
    );
    if (removedItems.length > 0) {
      removedItem.value = removedItems[0];
      showModal.value = true;
    }
  },
  { deep: true }
);

function closeModal() {
  showModal.value = false;
  modalReason.value = "";
}

function submitModal() {
  console.log("Reason submitted for item:", removedItem.value);
  console.log("Reason:", modalReason.value);
  closeModal();
}

function handlePrinterChangeInput(array: number[]) {
  mainInputValue.value = array.reduce(
    (sum: number, current: number) => sum + Number(current),
    0
  );
}

async function getDataAgent() {
  loading.value = true;
  const id = route.params.id_equipe;

  try {
    const response = await manage.getAgentsByEquipe(id);
    console.log(response);

    rows.value = Object.values(response[0].agents);

    selected.value = rows.value;
    printerInputValuesArray.value = rows.value.map(() => 0); // Initialiser les valeurs de saisie à 0
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getDataAgent();
});

function formatTimeRanges(data: any[]): { id: number; label: string }[] {
  return data.map((item) => {
    const startTime = new Date(item.heure_debut).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(item.heure_fin).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: item.id,
      label: `${startTime}-${endTime}`,
    };
  });
}
const timeRanges = formatTimeRanges(rawData);

// Création de la référence pour le modèle de sélection
const selectedTimeRange = ref(timeRanges[0]);

console.log(timeRanges);
</script>

<template>
  <div class="grid grid-cols-1">
    <div>
      <div class="flex items-center space-x-4 mb-4">
        <p>Nombre d'enrôlements</p>
        <UInput v-model="mainInputValue" class="w-[70px]" type="number" disabled />
        <p>Tranche horaire</p>
        <USelect v-model="selectedTimeRange" :options="timeRanges.map((range) => range.label)" />
      </div>

      <div>
        <p>Liste des agents de l'equipe A du 11/08/2024 de 07h-14h</p>
        <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' } }">
          <UTable v-model="selected" :rows="rows" :columns="columns" :loading="loading"
            :ui="{ td: { padding: 'py-1 px-2' } }">
            <template #actions-data="{ row, index }">
              <UInput type="number" v-model="printerInputValuesArray[index]" class="w-[70px]"
                @change="handlePrinterChangeInput(printerInputValuesArray)" />
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
            Pourquoi voulez-vous retirer cet agents ?
          </h3>
        </template>
        <div class="mt-2">
          <p v-if="removedItem">
            Motif de retrait de {{ removedItem.nom_agent }} ?
          </p>
          <USelect color="primary" variant="outline" :options="['maladie', 'congés','autre']" model-value="United States" />
          <UInput v-model="modalReason" type="text" placeholder="Entrez le motif ici"
            class="mt-2 w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <template #footer>
          <div class="mt-4 flex justify-end space-x-2">
            <UButton color="gray" label="Annuler" @click="closeModal" />
            <UButton color="red" label="Confirmer" @click="submitModal" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
