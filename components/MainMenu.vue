<script setup lang="ts">
const token = useTokenStore();
const data = useDataStore();

const links: any = [
  [
    {
      labelClass: "logo",
    },
    {
      label: token.getDataInfo.valid_roles_and_sites[0].region,
      labelClass: "region",
      disabled: true,
    },
    {
      label: token.getDataInfo.valid_roles_and_sites[0].site_name,
      labelClass: "localite",
      disabled: true,
    },
    {
      label: token.getDataInfo.agent.nom,
      disabled: true,
      labelClass: "nom",
    },
    // {
    //   label: `Site ${siteId}`,
    // },
  ],
  [
    {
      label: "Enrôlement",
      to: "/",
    },
    {
      label: "Production en masse",
      to: "/production",
    },
    {
      label: "Distribution",
      to: "/distribution",
    },
    {
      label: "Recapitulatif",
      to: `/tab-recap`,
    },

    {
      label: "Recapitulatif global",
      to: "/recap",
    },
    {
      label: "Site & Equipes",
      to: "/site-equipe",
    },

    {
      labelClass: "deco",
      label: "Déconnexion",
      click: () => {
        token.deleteInfo();
        // data.deleteData();
        // data.deleteDate();
        navigateTo("/login");
      },
    },
  ],
];

const isOpen = ref(false);

onMounted(() => {
  console.log(token.data);
});
</script>

<template>
  <!-- , active: 'after:bg-transparent'  -->
  <div class="s">
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800 mb-4"
      :ui="{
        before: 'hover:before:bg-transparent',
        active: 'text-orange-500 after:bg-transparent after:mt-4',
      }"
    >
      <template #default="{ link }">
        <h1
          v-if="link.labelClass === 'region'"
          class="text-[#009EDF] pr-4 py-3 border-r-2 border-gray-500"
        >
          {{ link.label }}
        </h1>
        <h1
          v-if="link.labelClass === 'localite'"
          class="text-[#47A126] pr-4 py-3 border-r-2 border-gray-500"
        >
          {{ link.label }}
        </h1>
        <h1 v-if="link.labelClass === 'nom'" class="">{{ link.label }}</h1>
        <img
          src="/img/logo-cnam.jpeg"
          alt=""
          v-if="link.labelClass === 'logo'"
          class="2xs w-[50px] h-[50px] object-cover"
        />
        <UButton
          v-if="link.labelClass === 'deco'"
          color="red"
          :label="link.label"
        />
      </template>
    </UHorizontalNavigation>
  </div>

  <!-- <div class="block 2xl:hidden">
    <div class="w-full p-4 divide-y">
      <div class="flex justify-between items-center">
        <img
          src="/img/logo-cnam.jpeg"
          alt=""
          class="2xs w-[50px] h-[50px] object-cover"
        />

        <div>
          <UButton label="Open" @click="isOpen = true" />

          <USlideover v-model="isOpen">
            <div class="p-4 flex-1">
              <UButton
                color="gray"
                variant="ghost"
                size="sm"
                icon="i-heroicons-x-mark-20-solid"
                class="flex sm:hidden absolute end-5 top-5 z-10"
                square
                padded
                @click="isOpen = false"
              />
              <Placeholder class="h-full" />
            </div>
          </USlideover>
        </div>

        
      </div>
    </div>
  </div> -->
</template>
