<script setup lang="ts">
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
  {
    key: "motif",
    label: "Motif",
  },
  {
    key: "commentaire",
    label: "Commentaire",
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

const schema = z.object({
  motif: z.string({ message: "Champs obligatoire" }).min(1, "Champs requis"),
});

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, maxLength - 3);
  return `${truncated}...`;
}

const loadTableData = async (nbr_kit: number, nbr_imp: number) => {
  console.log("Data to update:", { nbr_equipement: nbr_kit + nbr_imp });
  dataStore.updateData({
    nbr_equipement: nbr_kit + nbr_imp,
    nbr_Imp: nbr_imp,
    nbr_kit: nbr_kit,
    equipe_id_fk: Number(route.params.id_equipe),
    type_operation: Number(route.params.type_operation),
  });
};

function deselectAndPrefillEquipment() {
  dataStore.collectedData.detaileq.forEach((detail: any) => {
    console.log("Processing detail:", detail);
    if (detail.type_probleme_id_fk !== 0) {
      // Décocher l'élément
      if (detail.statut === "kit") {
        selected.value = selected.value.filter(
          (item: any) => item.id_equipement !== detail.equipement_id_fk
        );
        mainInputValue.value = selected.value.length;
      } else if (detail.statut === "imp") {
        selectedImp.value = selectedImp.value.filter(
          (item: any) => item.id_equipement !== detail.equipement_id_fk
        );
        secondInputValue.value = selectedImp.value.length;
      }
      // Préremplir les entrées
      const item = (detail.statut === "kit" ? rows.value : imps.value).find(
        (i: any) => i.id_equipement === detail.equipement_id_fk
      );
      if (item) {
        item.commentaire = detail.commentaire;
        item.selectedMotif = detail.type_probleme_id_fk;
      }
    }
  });
}

async function getDataKit() {
  loading.value = true;
  try {
    const response = await manage.getKit(
      token.getDataInfo.valid_roles_and_sites[0].id_site
    );
    console.log("Response from getKit:", response);

    if (response.length !== 0) {
      imps.value = Object.values(
        route.params.type_operation === "1" ? response["5"] : response["6"]
      );
      rows.value = Object.values(
        route.params.type_operation === "1" ? response["1"] : response["3"]
      );

      console.log("Rows:", rows.value);
      console.log("Imps:", imps.value);

      // Assurez-vous que les données sont bien préremplies
      rows.value.forEach((row: any) => {
        saveEquipmentDetail(row.id_equipement, "RAS", 0, "operationnel");
      });

      imps.value.forEach((imp: any) => {
        saveEquipmentDetail(imp.id_equipement, "RAS", 0, "operationnel");
      });

      selected.value = rows.value;
      selectedImp.value = imps.value;
      token.setObjectif(selected.value.length * 50);

      // Appeler la fonction pour décocher et préremplir les équipements
      deselectAndPrefillEquipment();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function saveEquipmentDetail(
  id: number,
  commentaire: string,
  type_probleme_id_fk: number,
  statut: string
) {
  const existingDetail = dataStore.collectedData.detaileq.find(
    (detail: any) => detail.equipement_id_fk === id
  );
  if (existingDetail) {
    existingDetail.commentaire = commentaire;
    existingDetail.type_probleme_id_fk = type_probleme_id_fk;
    existingDetail.statut = statut;
  } else {
    dataStore.addDetailEq({
      equipement_id_fk: id,
      commentaire: commentaire,
      type_probleme_id_fk: type_probleme_id_fk,
      statut: statut,
    });
  }
}

function updateEquipmentDetail(
  id: number,
  commentaire: string,
  type_probleme_id_fk: number,
  statut: string
) {
  // Trouver l'équipement dans detaileq
  const existingDetail = dataStore.collectedData.detaileq.find(
    (detail: any) => detail.equipement_id_fk === id
  );

  if (existingDetail) {
    // Mettre à jour les détails
    existingDetail.commentaire = commentaire;
    existingDetail.type_probleme_id_fk = type_probleme_id_fk;
    existingDetail.statut = statut;
  } else {
    // Ajouter un nouveau détail s'il n'existe pas
    dataStore.addDetailEq({
      equipement_id_fk: id,
      commentaire: commentaire,
      type_probleme_id_fk: type_probleme_id_fk,
      statut: statut, // Assurez-vous de gérer le statut également
    });
  }
}

function deselectItemOnChange(itemId: number, type: "kit" | "imp") {
  const items = type === "kit" ? rows.value : imps.value;
  const item = items.find((i: any) => i.id_equipement === itemId);

  if (item) {
    if (
      item.selectedMotif ||
      (item.commentaire && item.commentaire.trim() !== "")
    ) {
      // Si une valeur est sélectionnée ou entrée, décocher l'élément
      if (type === "kit") {
        selected.value = selected.value.filter(
          (i: any) => i.id_equipement !== itemId
        );
        mainInputValue.value = selected.value.length;
      } else {
        selectedImp.value = selectedImp.value.filter(
          (i: any) => i.id_equipement !== itemId
        );
        secondInputValue.value = selectedImp.value.length;
      }
      updateEquipmentDetail(
        item.id_equipement,
        item.commentaire,
        item.selectedMotif,
        "non_operationnel"
      );
    } else {
      // Si les deux champs sont vides, recocher l'élément s'il n'est pas déjà coché
      if (
        type === "kit" &&
        !selected.value.some((i: any) => i.id_equipement === itemId)
      ) {
        selected.value.push(item);
        mainInputValue.value = selected.value.length;
      } else if (
        type === "imp" &&
        !selectedImp.value.some((i: any) => i.id_equipement === itemId)
      ) {
        selectedImp.value.push(item);
        secondInputValue.value = selectedImp.value.length;
      }
    }
    loadTableData(mainInputValue.value, secondInputValue.value);
  }
}

watch(
  () => rows.value,
  () => {
    rows.value.forEach((row: any) => {
      if (
        row.selectedMotif ||
        (row.commentaire && row.commentaire.trim() !== "")
      ) {
        updateEquipmentDetail(
          row.id_equipement,
          row.commentaire,
          row.selectedMotif,
          "non_operationnel"
        );
      }
      deselectItemOnChange(row.id_equipement, "kit");
    });
  },
  { deep: true }
);

watch(
  () => imps.value,
  () => {
    imps.value.forEach((imp: any) => {
      if (
        imp.selectedMotif ||
        (imp.commentaire && imp.commentaire.trim() !== "")
      ) {
        updateEquipmentDetail(
          imp.id_equipement,
          imp.commentaire,
          imp.selectedMotif,
          "non_operationnel"
        );
      }
      deselectItemOnChange(imp.id_equipement, "imp");
    });
  },
  { deep: true }
);

watch(
  () => [...rows.value, ...imps.value],
  (items) => {
    items.forEach((item: any) => {
      const isSelected = (
        item.id_equipement in rows.value ? selected : selectedImp
      ).value.some((i: any) => i.id_equipement === item.id_equipement);

      if (isSelected) {
        // Si l'item est sélectionné, on le retire de detaileq
        dataStore.removeDetailEq(item.id_equipement);
      } else if (
        item.selectedMotif ||
        (item.commentaire && item.commentaire.trim() !== "")
      ) {
        // Si l'item n'est pas sélectionné mais a un motif ou un commentaire, on l'ajoute à detaileq
        updateEquipmentDetail(
          item.id_equipement,
          item.commentaire,
          item.selectedMotif,
          "non_operationnel"
        );
      }

      deselectItemOnChange(
        item.id_equipement,
        item.id_equipement in rows.value ? "kit" : "imp"
      );
    });
  },
  { deep: true }
);

watch([() => rows.value, () => imps.value], () => {
  console.log("Updated rows:", rows.value);
  console.log("Updated imps:", imps.value);
});

const addEquipmentDetail = (motif: any, id: any, commentaire: string) => {
  const newDetail: any = {
    equipement_id_fk: id,
    commentaire: commentaire,
    type_probleme_id_fk: Number(motif),
  };
  dataStore.addDetailEq(newDetail);
};

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
  if (token.getDataInfo.valid_roles_and_sites[0].role_id === 3) {
    dataStore.updateData({ commentaire_globale_chief: state.message });
  } else {
    dataStore.updateData({ globl_comment_superviseur: state.message });
  }

  closeModal();
}

function showGlobalCommentModal() {
  showModal.value = true;
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
      <p class="mb-3">Liste des kits utilisés</p>
      <UCard
        :ui="{
          body: { padding: 'px-0 py-0 sm:p-0' },
          base: 'w-[800px] h-[30]',
        }"
      >
        <UTable
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'Aucune donnée disponible.',
          }"
          :loading="loading"
          v-model="selected"
          :rows="rows"
          :columns="columns"
          :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-full' }"
        >
          <template #id_equipement-data="{ row }">
            <p class="hidden">{{ row.id_equipement }}</p>
          </template>
          <template #numero_serie-data="{ row }">
            {{ truncateText(row.numero_serie, 10) }}
          </template>
          <template #motif-data="{ row }">
            <USelect
              placeholder="Motif de retrait"
              variant="outline"
              :options="[
                { name: 'Panne', value: 1 },
                { name: 'Maintenance', value: 2 },
              ]"
              v-model="row.selectedMotif"
              option-attribute="name"
            />
          </template>
          <template #commentaire-data="{ row }">
            <UTextarea v-model="row.commentaire" />
          </template>
        </UTable>
      </UCard>
    </div>
  </div>

  <div class="mt-5">
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
      <p class="mb-3">Liste des imprimantes utilisées</p>
      <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[800px]' }">
        <UTable
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'Aucune donnée disponible.',
          }"
          :loading="loading"
          v-model="selectedImp"
          :rows="imps"
          :columns="columns"
          :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-full' }"
        >
          <template #id_equipement-data="{ row }">
            <p class="hidden">{{ row.id_equipement }}</p>
          </template>
          <template #numero_serie-data="{ row }">
            {{ truncateText(row.numero_serie, 10) }}
          </template>
          <template #motif-data="{ row }">
            <USelect
              placeholder="Motif de retrait"
              variant="outline"
              :options="[
                { name: 'Panne', value: 1 },
                { name: 'Maintenance', value: 2 },
              ]"
              v-model="row.selectedMotif"
              option-attribute="name"
              :disabled="
                token.getDataInfo.valid_roles_and_sites[0].role_id === 2
              "
            />
          </template>
          <template #commentaire-data="{ row }">
            <UTextarea
              v-model="row.commentaire"
              :disabled="
                token.getDataInfo.valid_roles_and_sites[0].role_id === 2
              "
            />
          </template>
        </UTable>
      </UCard>
    </div>
  </div>

  <div class="text-center mt-8">
    <UButton
      label="Commentaire globale"
      color="red"
      @click="showGlobalCommentModal"
    />
  </div>

  <UModal v-model="showModal">
    <UCard>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Avez vous d'autres observations ?
        </h3>
      </template>
      <div class="mt-2">
        <UForm :state="state" @submit="confirmRemoval">
          <UFormGroup name="message">
            <UTextarea
              v-model="state.message"
              type="text"
              placeholder="commentaire..."
              class="mt-2 border border-gray-300 rounded-md"
            />
          </UFormGroup>
          <div class="mt-4 flex justify-end space-x-2">
            <UButton color="gray" label="Annuler" @click="closeModal" />
            <UButton color="blue" label="Confirmer" type="submit" />
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
