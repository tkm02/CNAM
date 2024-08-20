<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  middleware: "auth",
});

const manage = useManageStore();
const route = useRoute();
const rows = ref<{}[]>([]);
const imps = ref<{}[]>([]);
const mobile = ref<{}[]>([]);
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
const selectedMobile = ref<any>([]);

const showModal = ref(false);
const mainInputValue = ref(0);
const secondInputValue = ref(0);
const thirdInputValue = ref(0);
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

const loadTableData = async (
  nbr_kit: number,
  nbr_imp: number,
  nbr_mobi: number
) => {
  console.log("Data to update:", {
    nbr_equipement: nbr_kit + nbr_imp + nbr_mobi,
  });
  dataStore.updateData({
    nbr_equipement: nbr_kit + nbr_imp + nbr_mobi,
    nbr_Imp: nbr_imp,
    nbr_kit: nbr_kit,
    nbr_mobi: nbr_mobi,
    equipe_id_fk: Number(route.params.id_equipe),
    type_operation: Number(route.params.type_operation),
  });
};

function deselectAndPrefillEquipment() {
  dataStore.collectedData.detaileq.forEach((detail: any) => {
    console.log("Processing detail:", detail);

    if (detail.type_probleme_id_fk !== 0) {
      // Décocher l'élément
      if (detail.type_eq === "kit") {
        selected.value = selected.value.filter(
          (item: any) => item.id_equipement !== detail.equipement_id_fk
        );
        mainInputValue.value = selected.value.length;
      } else if (detail.type_eq === "imp") {
        selectedImp.value = selectedImp.value.filter(
          (item: any) => item.id_equipement !== detail.equipement_id_fk
        );
        secondInputValue.value = selectedImp.value.length;
      } else if (detail.type_eq === "mobi" || detail.statut === "mobile") {
        selectedMobile.value = selectedMobile.value.filter(
          (item: any) => item.id_equipement !== detail.equipement_id_fk
        );
        thirdInputValue.value = selectedMobile.value.length;
      }

      // Préremplir les entrées
      const items =
        detail.type_eq === "kit"
          ? rows.value
          : detail.statut === "imp"
          ? imps.value
          : selectedMobile.value; // Correction pour gérer les éléments "mobi" ou "mobile"

      const item = items.find(
        (i: any) => i.id_equipement === detail.equipement_id_fk
      );

      if (item) {
        item.commentaire = detail.commentaire;
        item.selectedMotif = detail.type_probleme_id_fk;
      }
    }
  });
}

// async function getDataKit() {
//   loading.value = true;
//   try {
//     const response = await manage.getKit(
//       token.getDataInfo.valid_roles_and_sites[0].id_site
//     );
//     console.log("Response from getKit:", response);

//     if (response) {
//       imps.value = Object.values(
//         route.params.type_operation === "1" ? response["5"] : response["6"]
//       );
//       rows.value = Object.values(
//         route.params.type_operation === "1" ? response["1"] : response["3"]
//       );
//       mobile.value = Object.values(
//         route.params.type_operation === "1" ? response["2"] : []
//       );

//       console.log("mobil" + mobile);

//       // Assurez-vous que les données sont bien préremplies dans detaileq
//       rows.value.forEach((row: any) => {
//         saveEquipmentDetail(
//           row.id_equipement,
//           "RAS",
//           0,
//           "operationnel",
//           row.nom_equipement
//         );
//       });

//       imps.value.forEach((imp: any) => {
//         saveEquipmentDetail(
//           imp.id_equipement,
//           "RAS",
//           0,
//           "operationnel",
//           imp.nom_equipement
//         );
//       });

//       mobile.value.forEach((mobi: any) => {
//         saveEquipmentDetail(
//           mobi.id_equipement,
//           "RAS",
//           0,
//           "operationnel",
//           mobi.nom_equipement
//         );
//       });

//       // Ajouter les équipements au dataStore.collectedData.detaileq
//       dataStore.collectedData.detaileq = [
//         ...rows.value,
//         ...imps.value,
//         ...mobile.value,
//       ].map((item:any) => ({
//         equipement_id_fk: item.id_equipement,
//         commentaire: "RAS",
//         type_probleme_id_fk: 0,
//         statut: "operationnel",
//         nom_eq: item.nom_equipement,
//       }));

//       selected.value = rows.value;
//       selectedImp.value = imps.value;
//       selectedMobile.value = mobile.value;

//       token.setObjectif(selected.value.length * 50);
//       deselectAndPrefillEquipment();
//     }
//   } catch (error) {
//     console.log(error);
//   } finally {
//     loading.value = false;
//   }
// }

async function getDataKit() {
  loading.value = true;
  try {
    const response = await manage.getKit(
      token.getDataInfo.valid_roles_and_sites[0].id_site
    );
    console.log("Response from getKit:", response);

    if (response) {
      imps.value = Object.values(
        route.params.type_operation === "1" ? response["5"] : response["6"]
      );
      rows.value = Object.values(
        route.params.type_operation === "1" ? response["1"] : response["3"]
      );

      selected.value = rows.value;
      selectedImp.value = imps.value;
      selectedMobile.value = mobile.value;

      token.setObjectif(selected.value.length * 50);
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
  statut: string,
  nom_eq: string,
  type_eq: string
) {
  const existingDetail: any = dataStore.collectedData.detaileq.find(
    (detail: any) => detail.equipement_id_fk === id
  );
  if (existingDetail) {
    existingDetail.commentaire = commentaire;
    existingDetail.type_probleme_id_fk = Number(type_probleme_id_fk);
    existingDetail.statut = statut;
  } else {
    dataStore.addDetailEq({
      equipement_id_fk: id,
      commentaire: commentaire,
      type_probleme_id_fk: Number(type_probleme_id_fk),
      statut: statut,
      nom_eq: nom_eq,
      type_eq: type_eq,
    });
  }
}

function updateEquipmentDetail(
  id: number,
  commentaire: string,
  type_probleme_id_fk: number,
  statut: string,
  nom_eq: string,
  type_eq: string
) {
  // Trouver l'équipement dans detaileq
  const existingDetail: any = dataStore.collectedData.detaileq.find(
    (detail: any) => detail.equipement_id_fk === id
  );

  if (existingDetail) {
    // Mettre à jour les détails
    existingDetail.commentaire = commentaire;
    existingDetail.type_probleme_id_fk = Number(type_probleme_id_fk);
    existingDetail.statut = statut;
  } else {
    // Ajouter un nouveau détail s'il n'existe pas
    dataStore.addDetailEq({
      equipement_id_fk: id,
      commentaire: commentaire,
      type_probleme_id_fk: Number(type_probleme_id_fk),
      statut: statut,
      nom_eq: nom_eq,
      type_eq: type_eq,
    });
  }
}

function deselectItemOnChange(itemId: number, type: "kit" | "imp" | "mobi") {
  const items =
    type === "kit"
      ? rows.value
      : type === "imp"
      ? imps.value
      : selectedMobile.value;
  const item = items.find((i: any) => i.id_equipement === itemId);

  if (item) {
    if (
      item.selectedMotif ||
      (item.commentaire && item.commentaire.trim() !== "")
    ) {
      // Si un motif ou un commentaire est présent, désélectionner l'élément
      if (type === "kit") {
        selected.value = selected.value.filter(
          (i: any) => i.id_equipement !== itemId
        );
        mainInputValue.value = selected.value.length;
      } else if (type === "imp") {
        selectedImp.value = selectedImp.value.filter(
          (i: any) => i.id_equipement !== itemId
        );
        secondInputValue.value = selectedImp.value.length;
      } else if (type === "mobi") {
        selectedMobile.value = selectedMobile.value.filter(
          (i: any) => i.id_equipement !== itemId
        );
        thirdInputValue.value = selectedMobile.value.length;
      }

      // Mise à jour des détails de l'équipement
      updateEquipmentDetail(
        item.id_equipement,
        item.commentaire,
        item.selectedMotif,
        "non_operationnel",
        item.nom_equipement,
        type
      );
    }
  }
}

watch(
  () => [...rows.value, ...imps.value, ...mobile.value],
  (newItems) => {
    newItems.forEach((item: any) => {
      const type =
        item.id_equipement in rows.value
          ? "kit"
          : item.id_equipement in imps.value
          ? "imp"
          : "mobi";
      if (
        item.selectedMotif ||
        (item.commentaire && item.commentaire.trim() !== "")
      ) {
        updateEquipmentDetail(
          item.id_equipement,
          item.commentaire,
          item.selectedMotif,
          "non_operationnel",
          item.nom_equipement,
          type
        );
        deselectItemOnChange(item.id_equipement, item.statut);
      }
    });
  },
  { deep: true }
);

watch(
  () => [...rows.value, ...imps.value, ...mobile.value],
  (items) => {
    items.forEach((item: any) => {
      // Déterminer la liste de sélection appropriée
      const isSelected = (
        item.id_equipement in rows.value
          ? selected.value
          : item.id_equipement in imps.value
          ? selectedImp.value
          : selectedMobile.value
      ).some((i: any) => i.id_equipement === item.id_equipement);
      // Déterminer le type d'équipement pour la désélection
      const type =
        item.id_equipement in rows.value
          ? "kit"
          : item.id_equipement in imps.value
          ? "imp"
          : "mobi";

      if (!isSelected) {
        // Si l'item n'est pas sélectionné, mais a un motif ou un commentaire, on l'ajoute à detaileq
        if (
          item.selectedMotif ||
          (item.commentaire && item.commentaire.trim() !== "")
        ) {
          updateEquipmentDetail(
            item.id_equipement,
            item.commentaire,
            item.selectedMotif,
            "non_operationnel",
            item.nom_equipement,
            type
          );
        }
      } else {
        // Si l'item est sélectionné, ne pas le retirer de detaileq
        // Vous pouvez ajouter ici une logique supplémentaire si nécessaire
      }

      deselectItemOnChange(item.id_equipement, type);
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
    thirdInputValue.value = selectedMobile.value.length;
    loadTableData(
      mainInputValue.value,
      secondInputValue.value,
      thirdInputValue.value
    );

    if (token.getDataInfo.valid_roles_and_sites[0].role_id == 3) {
      // Assurez-vous que les données sont bien préremplies dans detaileq
      const allEquipments = [...rows.value, ...imps.value, ...mobile.value];

      allEquipments.forEach((item: any) => {
        const type = rows.value.some(
          (row: any) => row.id_equipement === item.id_equipement
        )
          ? "kit"
          : imps.value.some(
              (imp: any) => imp.id_equipement === item.id_equipement
            )
          ? "imp"
          : "mobi";

        saveEquipmentDetail(
          item.id_equipement,
          "RAS",
          0,
          "operationnel",
          item.nom_equipement,
          type
        );
      });
    }
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

    <div class="mt-5">
      <div class="flex items-center space-x-4">
        <p style="font-weight: bold">Nombre des kits ultra mobile</p>
        <UInput
          v-model="thirdInputValue"
          class="w-[70px]"
          type="number"
          disabled
        />
      </div>

      <div class="mt-4">
        <p class="mb-3">Liste des kits ultra mobiles</p>
        <UCard
          :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[800px]' }"
        >
          <UTable
            :empty-state="{
              icon: 'i-heroicons-circle-stack-20-solid',
              label: 'Pas de kits ultra mobile dans ce site',
            }"
            :loading="loading"
            v-model="selectedMobile"
            :rows="mobile"
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
  </div>

  <div class="text-center mt-8">
    <UButton
      label="Commentaire global"
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
