<script setup lang="ts">
const token = useTokenStore();
const links = [
  [],
  [
    {
      labelClass: "deco",
      label: "Déconnexion",
      click: () => {
        token.deleteToken();
        navigateTo('/login')
      },
    },
  ],
];
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
  />
</template>
