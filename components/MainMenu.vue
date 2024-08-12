<script setup lang="ts">
const token = useTokenStore();
const data = useDataStore();

const links: any = [
  [
    {
      labelClass: 'logo'
    },
    {
      label: token.getRegion,
      labelClass: 'region'
    },
    {
      label: token.getLocalites,
      labelClass: 'localite'
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
      label: "Production",
      to: "/production",
    },
    {
      label: "Distribution",
      to: "/distribution",
    },

    // {
    //   label: "Recap",
    //   to: "/recap",
    // },
    {
      label: "Recap",
      to: `/recap/${token.getId}`,
    },

  ],
  [
    {
      labelClass: "deco",
      label: "Déconnexion",
      click: () => {
        token.deleteToken();
        data.deleteData();
        data.deleteDate();
        navigateTo("/login");
      },
    },
  ],
];
</script>

<template>
  <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800 mb-4"
    :ui="{ before: 'hover:before:bg-transparent', active: 'after:bg-transparent' }">
    <template #default="{ link }">
      <h1 v-if="link.labelClass === 'region'" class="text-[#009EDF] pr-4 py-3 border-r-2 border-gray-500">{{ link.label }}</h1>
      <h1 v-if="link.labelClass === 'localite'" class="text-[#47A126]">{{ link.label }}</h1>
      <img src="/img/logo-cnam.jpeg" alt="" v-if="link.labelClass === 'logo'"
        class="2xs w-[50px] h-[50px] object-cover" />
      <UButton v-if="link.labelClass === 'deco'" color="red" :label="link.label" />
    </template>
  </UHorizontalNavigation>
</template>
