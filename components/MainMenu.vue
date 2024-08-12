<script setup lang="ts">
const token = useTokenStore();
const data = useDataStore();

const siteId = token.getSiteId;

const links: any = [
  [
    {
      labelClass:'logo'
    },
    {
      label: token.getLocalites,
    },
    {
      label: `Site ${siteId}`,
    },
  ],
  [
    // Filtrer les liens en fonction du siteId
    ...(siteId !== 2
      ? [
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
        ]
      : []),
    ...(siteId !== 1
      ? [
          {
            label: "Mission camion",
            to: "/mission_camion",
          },
        ]
      : []),
    {
      label: "Recap",
      to: "/recap",
    },
    {
      label: "Recap du site",
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
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800 mb-4"
    :ui="{before:'hover:before:bg-transparent', active:'after:bg-transparent'}"
  >
  <template #default="{ link }">
    <img
      src="/img/logo-cnam.jpeg"
      alt=""
      v-if="link.labelClass === 'logo'"
      class="2xs w-[100px] h-[50px] object-cover"
    />
  </template>
</UHorizontalNavigation>
</template>
