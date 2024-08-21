<script setup lang="ts">
const columns = [
  {
    key: "region",
    label: "Region",
  },
  {
    key: "type_de_site",
    label: "SITE IN SITU",
  },
  {
    key: "equipe",
    label: "Équipe",
  },
  {
    key: "horaire",
    label: "Horaire",
  },
  {
    key: "nb_op",
    label: "Nb OP",
  },
  {
    key: "nb_kit",
    label: "Nb KIT",
  },
  {
    key: "objectif",
    label: "Capacité installée",
  },
  {
    key: "realise",
    label: "Réalisé",
  },
  {
    key: "non_realise",
    label: "Non réalisé",
  },
  {
    key: "objectif_depasse",
    label: "Objectif dépassé",
  },
];

const columnsObservation = [
  {
    key: "superviseur",
    label: "RESPONSABLE DU CENTRE",
  },
  {
    key: "chef_equipe",
    label: "RESPONSABLE DE L'ÉQUIPE",
  },
];

const rowsSignature = [
  {
    superviseur: "Oui",
    chef_equipe: "Non",
  },
];

const data = ref([
  {
    region: "",
    type_de_site: "",
    equipe: 0,
    horaire: "",
    nb_op: 0,
    nb_kit: 0,
    objectif: { value: 0, class: "" },
    realise: 0,
    non_realise: { value: "0", class: "" },
    objectif_depasse: { value: "0", class: "" },
  },
]);

const toast = useToast();

const comment = ref([
  {
    superviseur: "",
    chef_equipe: "",
  },
]);

const dataStore = useDataStore();
const tokenStore = useTokenStore();
const loading = ref(false);
const date = ref("");
const isActif = ref(
  dataStore.collectedData.signature_chef != "" &&
    dataStore.collectedData.signature_superviseur != ""
);

// Fonction pour mettre à jour les données

function getDate(id: any) {
  switch (id) {
    case 1:
      return "08H-17H";
      break;
    case 2:
      return "07H-14H";
      break;
    case 3:
      return "14H-21H";
      break;
    case 4:
      return "21H-07H";
      break;

    default:
      return "-";
      break;
  }
}

function updateData() {
  loading.value = true;
  console.log(dataStore.collectedData);

  try {
    data.value = [
      {
        region: tokenStore.getDataInfo.valid_roles_and_sites[0].region ?? "",
        type_de_site:
          tokenStore.getDataInfo.valid_roles_and_sites[0].site_name ?? "",
        equipe: dataStore.collectedData.equipe_id_fk,
        horaire: getDate(dataStore.collectedData.tranche_horaire_id),
        nb_op: dataStore.collectedData.nbr_agent,
        nb_kit: dataStore.collectedData.nbr_kit,
        objectif: {
          value: dataStore.collectedData.objectif,
          class: "bg-blue-500/50 text-black",
        },
        realise: dataStore.collectedData.realise,
        non_realise: {
          value:
            dataStore.collectedData.objectif > dataStore.collectedData.realise
              ? String(
                  dataStore.collectedData.objectif -
                    dataStore.collectedData.realise
                )
              : "-",
          class:
            dataStore.collectedData.objectif > dataStore.collectedData.realise
              ? "bg-red-500/50 text-black"
              : "bg-white text-black",
        },
        objectif_depasse: {
          value:
            dataStore.collectedData.realise > dataStore.collectedData.objectif
              ? String(
                  dataStore.collectedData.realise -
                    dataStore.collectedData.objectif
                )
              : "-",
          class:
            dataStore.collectedData.realise > dataStore.collectedData.objectif
              ? "bg-green-500/50 text-black"
              : "bg-white text-black",
        },
      },
    ];

    comment.value = [
      {
        superviseur: dataStore.collectedData.globl_comment_superviseur || "",
        chef_equipe: dataStore.collectedData.commentaire_globale_chief || "",
      },
    ];

    date.value = dataStore.collectedData.date;
  } catch (error) {
  } finally {
    loading.value = false;
  }

  console.log(data.value);
}

async function handleSubmit() {
  loading.value = true;
  try {
    const roleId = tokenStore.getDataInfo.valid_roles_and_sites[0].role_id;

    if (roleId === 3) {
      const response = await dataStore.addData(dataStore.collectedData);

      if (response.message == 201) {
        if (
          dataStore.collectedData.signature_chef != "" &&
          dataStore.collectedData.signature_superviseur != ""
        ) {
          isActif.value = true;
        } else {
          navigateTo("/");
        }
      } else {
        alert("Une erreur est survenue !");
        console.log(response);
      }
    } else {
      if (
        dataStore.collectedData.signature_chef != "" &&
        dataStore.collectedData.signature_superviseur != ""
      ) {
        isActif.value = true;
      }
    }
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Ooops, une erreur est survenue !",
      color: "red",
      ui: {
        title: "text-red-500",
      },
    });
  } finally {
    loading.value = false;
  }

  console.log(dataStore.collectedData);
}

const handleSignatureUpdate = (signature: string) => {
  if (tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 2) {
    dataStore.collectedData.signature_chef = signature;
  } else if (tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 3) {
    dataStore.collectedData.signature_superviseur = signature;
  }
};

function formatDate() {
  // Récupère la date sélectionnée ou une chaîne vide si non définie
  const dates = dataStore.collectedData.date || "";

  // Ajoutez ceci pour voir ce que contient `dates`
  console.log("Date récupérée:", dates);

  // Vérifie si la date est vide ou non valide
  if (!dates) {
    date.value = "Date non disponible";
    return;
  }

  // Divise la date en composants année, mois, jour
  const components = dates.split("-");

  // Vérifie si la date a bien été divisée en trois parties (année, mois, jour)
  if (components.length !== 3) {
    date.value = "Format de date incorrect";
    return;
  }

  // Inverse l'ordre des composants
  const reversedComponents = components.reverse();

  // Recombine les composants avec des barres obliques
  date.value = reversedComponents.join("/");
}

onMounted(() => {
  updateData();
  formatDate();
});
</script>

<template>
  <div class="container mx-auto px-4 mt-5">
    <h1 class="text-center text-sm font-bold mb-4">
      Date:
      <span class="text-lg font-thin">{{ date }}</span>
    </h1>

    <UTable
      class="mb-5"
      :ui="{
        tr: {
          base: 'border border-gray-500',
        },
        th: {
          base: 'bg-orange-500/50 border border-gray-500 text-center',
          padding: 'py-1 px-2',
          color: 'text-black',
        },
        td: {
          base: 'border border-gray-500 text-center',
          padding: 'py-1 px-2',
          color: 'text-black',
        },
      }"
      :columns="columns"
      :rows="data"
      :loading="loading"
    >
      <template #objectif-data="{ row }">
        {{ row.objectif.value }}
      </template>
      <template #non_realise-data="{ row }">
        {{ row.non_realise.value }}
      </template>
      <template #objectif_depasse-data="{ row }">
        {{ row.objectif_depasse.value }}
      </template>
    </UTable>

    <div class="flex justify-center">
      <UCard
        class="mb-5 w-[600px]"
        :ui="{
          body: { padding: 'px-0 py-0 sm:p-0' },
          shadow: 'shadow-none',
          rounded: 'rounded-none',
        }"
        :loading="loading"
      >
        <UTable
          :ui="{
            th: {
              base: 'border border-gray-500 text-center w-[25%]',
              padding: 'py-1 px-2',
            },
            td: {
              base: 'border border-b- border-gray-500 text-center w-[250px] text-left',
              padding: 'py-1 px-2',
            },
          }"
          :rows="comment"
          :columns="columnsObservation"
        >
          <template #caption>
            <caption>
              Observations
            </caption>
          </template>
          <template #chef_equipe-data="{ row }">
            <div class="w-[100%] text-wrap">
              <!-- <p class="mb-3">Observations détaillées :</p> -->
              <ul
                class="pl-4"
                v-if="dataStore.collectedData.detaileq.length !== 0"
              >
                <li v-for="data in dataStore.collectedData.detaileq">
                  <div v-if="data['type_probleme_id_fk'] !== 0" class="mb-4">
                    <span class="font-bold">-{{ data["nom_eq"] }}</span>
                    <span class="font-bold">- motif</span> :
                    {{
                      data["type_probleme_id_fk"] == 1 ? "Panne" : "Maintenance"
                    }}
                    <br>
                    <span class="font-bold">- commentaire</span> :
                    {{ data["commentaire"] }} <br />
                  </div>
                </li>
              </ul>
              <ul>
                <li>
                  <span class="font-bold">Commetaire global : </span
                  >{{ row.chef_equipe ?? "RAS" }}
                </li>
              </ul>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <div class="flex justify-center">
      <UCard
        :ui="{
          body: { padding: 'px-0 py-0 sm:p-0' },
          shadow: 'shadow-none',
          rounded: 'rounded-none',
        }"
        class="mb-5 w-[400px]"
        :loading="loading"
      >
        <UTable
          :ui="{
            th: {
              base: 'border border-gray-500 text-center',
              padding: 'py-1 px-2',
            },
            td: {
              base: 'border border-b- border-gray-500 text-center',
              padding: 'py-1 px-2',
            },
          }"
          :rows="rowsSignature"
          :columns="columnsObservation"
        >
          <template #caption>
            <caption>
              Signatures
            </caption>
          </template>
          <template #chef_equipe-data="{ row }">
            <div v-if="dataStore.collectedData.signature_chef">
              <img
                :src="dataStore.collectedData.signature_chef"
                alt="Signature Chef"
                class="w-20 h-20"
              />
            </div>
            <div v-else>
              <ESignature
                v-show="
                  tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 3
                "
                @update-signature="handleSignatureUpdate"
              />
            </div>
          </template>
          <template #superviseur-data="{ row }">
            <div v-if="dataStore.collectedData.signature_superviseur">
              <img
                :src="dataStore.collectedData.signature_superviseur"
                alt="Signature Superviseur"
                class="w-20 h-20"
              />
            </div>
            <div v-else>
              <ESignature
                v-show="
                  tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 2
                "
                @update-signature="handleSignatureUpdate"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <div class="text-center" v-if="!isActif">
      <UButton label="Soumettre" size="lg" @click="handleSubmit" />
    </div>
    <div class="text-center" v-else>
      <UButton label="Exporter en pdf" size="lg" color="red" />
    </div>
  </div>
</template>
