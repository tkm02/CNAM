<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

definePageMeta({
  middleware: "auth",
});

const manage = useManageStore();
const route = useRoute();
const rows = ref<{}[]>([]);
const imps = ref<any>([]);
const dataStore = useDataStore();
const columns = [
  {
    key: "id_equipement",
  },
  {
    key: "nom_equipement",
    label: "Type d'equipement",
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
const token = useTokenStore();

const itemToRemove = ref<any>(null);
const removalReason = ref("");

const state = reactive({
  message: undefined,
  motif: undefined,
});

// const loadTableData = async (data1: number, data2: number) => {
//   dataStore.updateData({ nbr_equipement: data1 + data2 });
// };

const schema = z.object({
  motif: z.string({ message: "Champs obligatoire" }).min(1, 'Champs requis'),
});

const loadTableData = async (nbr_kit: number, nbr_imp: number) => {
  console.log("Data to update:", { nbr_equipement: nbr_kit + nbr_imp }); // Log pour vérifier les données
  dataStore.updateData({
    nbr_equipement: nbr_kit + nbr_imp,
    nbr_Imp: nbr_imp,
    nbr_kit: nbr_kit,
    equipe_id_fk: Number(route.params.id_equipe),
    type_operation: Number(route.params.type_operation),
  });
};

async function getDataKit() {
  loading.value = true;
  try {
    const response = await manage.getKit(token.getSiteId);

    console.log(response);

    imps.value = Object.values(response["2"]);
    rows.value = Object.values(response["1"]);
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

const addEquipmentDetail = (id_pb: any, motif: any, id: any) => {
  const newDetail: any = {
    equipement_id_fk: id,
    commentaire: motif,
    type_probleme_id_fk: Number(id_pb),
  };
  dataStore.addDetailEq(newDetail);
};

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
});

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

  addEquipmentDetail(
    state.motif,
    state.message,
    itemToRemove.value.id_equipement
  );

  closeModal();
}
</script>

<template>
  <div>
    <div class="flex items-center space-x-4">
      <p style="font-weight: bold">Nombre de kits</p>
      <UInput
        v-model="mainInputValue"
        class="w-[70px]"
        type="number"
        disabled
      />
    </div>

    <div class="mt-4">
      <p class="mb-3">
        Liste des kits utilisés
      </p>
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
      <p style="font-weight: bold">Nombre d'imprimantes</p>
      <UInput
        v-model="secondInputValue"
        class="w-[70px]"
        type="number"
        disabled
      />
    </div>

    <div class="mt-4">
      <p class="mb-3">
        Liste des imprimantes utilisées
      </p>
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
          Pour quel motif cet équipement n'a pas été utilisé ?
        </h3>
      </template>
      <div class="mt-2">
        <UForm :state="state" :schema="schema" @submit="confirmRemoval">
          <UFormGroup name="motif">
            <USelect
              placeholder="Motif de retrait"
              color="primary"
              variant="outline"
              :options="[
                { name: 'panne', value: 1 },
                { name: 'maintenance', value: 2 },
              ]"
              v-model="state.motif"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup name="message">
            <UTextarea
              v-model="state.message"
              type="text"
              placeholder="commentaire..."
              class="mt-2 border border-gray-300 rounded-md"
            />
          </UFormGroup>
          <p class="mt-3 text-xs italic text-gray-500">
            <span class="text-red-500">*</span>
            Selon le motif, donnez plus de précision (date, heure, point de circonstance, ...).
          </p>
          <div class="mt-4 flex justify-end space-x-2">
            <UButton color="gray" label="Annuler" @click="closeModal" />
            <UButton color="blue" label="Confirmer" type="submit" />
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
