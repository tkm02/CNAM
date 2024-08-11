<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  updateStatus: Function,
});
const manage = useManageStore();
const route = useRoute();
const rows = ref<{}[]>([]);
const imps = ref<any>([]);
const dataStore = useDataStore();
const status = ref(false);
const columns = [
  {
    key: "id_equipement",
  },
  {
    key: "nom_equipement",
    label: "Nom de l'équipement",
  },
  {
    key: "numero_serie",
    label: "Numero de serie",
  },
];

const selected = ref<any>([]);
const selectedImp = ref<any>([]);

const showModal = ref(false);
const mainInputValue = ref(0);
const secondInputValue = ref(0);
const loading = ref(false);

const itemToRemove = ref<any>(null);
const removalReason = ref("");

// const loadTableData = async (data1: number, data2: number) => {
//   dataStore.updateData({ nbr_equipement: data1 + data2 });
// };

const loadTableData = async (data1: number, data2: number) => {
  console.log("Data to update:", { nbr_equipement: data1 + data2 }); // Log pour vérifier les données
  dataStore.updateData({ nbr_equipement: data1 + data2 });
};


async function getDataKit() {
  loading.value = true;
  const id = route.params.id_equipe;
  try {
    const response = await manage.getKit(id);
    console.log(id);

    console.log(response);

    imps.value = Object.values(response["1"]);
    rows.value = Object.values(response["2"]);
    selected.value = rows.value;
    selectedImp.value = imps.value;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => selected.value,
  (newSelected, oldSelected) => {
    const deselectedItems = oldSelected.filter(
      (item: any) => !newSelected.includes(item)
    );

    if (deselectedItems.length > 0) {
      itemToRemove.value = deselectedItems[0];
      showModal.value = true;
    }

    mainInputValue.value = newSelected.length;
    loadTableData(mainInputValue.value, secondInputValue.value);
  },
  { deep: true }
);

watch(
  () => selectedImp.value,
  (newSelected, oldSelected) => {
    const deselectedItems = oldSelected.filter(
      (item: any) => !newSelected.includes(item)
    );

    if (deselectedItems.length > 0) {
      itemToRemove.value = deselectedItems[0];
      showModal.value = true;
    }

    secondInputValue.value = newSelected.length;
    loadTableData(mainInputValue.value, secondInputValue.value);
  },
  { deep: true }
);

onMounted(() => {
  getDataKit().then(() => {
    mainInputValue.value = selected.value.length;
    secondInputValue.value = selectedImp.value.length;
    loadTableData(mainInputValue.value, secondInputValue.value);
});

})
function closeModal() {
  showModal.value = false;
  itemToRemove.value = null;
  removalReason.value = "";
}

function confirmRemoval() {
  console.log("Motif de suppression :", removalReason.value);

  if (selected.value.includes(itemToRemove.value)) {
    selected.value = selected.value.filter(
      (item: any) => item.id !== itemToRemove.value.id
    );
  } else if (selectedImp.value.includes(itemToRemove.value)) {
    selectedImp.value = selectedImp.value.filter(
      (item: any) => item.id !== itemToRemove.value.id
    );
  }

  showModal.value = false;
  itemToRemove.value = null;
  removalReason.value = "";
}
</script>

<template>
  <div>
    <div class="flex items-center space-x-4">
      <p>Nombre de kits</p>
      <UInput
        v-model="mainInputValue"
        class="w-[70px]"
        type="number"
        disabled
      />
    </div>

    <div class="mt-4">
      <p>Liste des kits utilisés pour la date du 11/08/2024</p>
      <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[450px]' }">
        <UTable
          :loading="loading"
          v-model="selected"
          :rows="rows"
          :columns="columns"
          :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-[400px]' }"
        >
          <template #id_equipement-data="{ row }">
            <p class="hidden">{{ row.id_equipement }}</p>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>

  <div>
    <div class="flex items-center space-x-4">
      <p>Nombre d'imprimantes</p>
      <UInput
        v-model="secondInputValue"
        class="w-[70px]"
        type="number"
        disabled
      />
    </div>

    <div class="mt-4">
      <p>Liste des imprimantes utilisées pour la date du 11/08/2024</p>
      <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[450px]' }">
        <UTable
          :loading="loading"
          v-model="selectedImp"
          :rows="imps"
          :columns="columns"
          :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-[400px]' }"
        >
          <template #id_equipement-data="{ row }">
            <p class="hidden">{{ row.id_equipement }}</p>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>

  <UModal v-model="showModal">
    <UCard>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Pourquoi voulez-vous retirer cet equipement ?
        </h3>
      </template>
      <div class="mt-2">
        <p v-if="itemToRemove">Motif de retrait {{ itemToRemove.name }}</p>
        <USelect
          color="primary"
          variant="outline"
          :options="['panne', 'maintenance']"
          model-value="United States"
        />
        <UInput
          v-model="removalReason"
          type="text"
          placeholder="Entrez le motif ici"
          class="mt-2 w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <template #footer>
        <div class="mt-4 flex justify-end space-x-2">
          <UButton color="gray" label="Annuler" @click="closeModal" />
          <UButton color="red" label="Confirmer" @click="confirmRemoval" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
