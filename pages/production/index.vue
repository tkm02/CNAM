<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

// const token = useTokenStore();
// const manage = useManageStore();
// let data: any;

// async function loadData() {
//   try {
//     const equipes = await manage.getAgentsByEquipe(token.getSiteId);
//     const equipements = await manage.getKit(token.getSiteId);
//     console.log(equipes);

//     data = {
//       equipe: equipes.map((e: any) => ({
//         libelle: e.equipe_name,
//         id_equipe: e.id_equpe,
//       })),
//       agents: Object.values(equipes).flatMap((e: any) =>
//         e.agents.map((t: any) => ({
//           id_agent: t.id_agent,
//           nom_agent: t.nom_agent,
//         }))
//       ),
//       equipement: {
//         imprimantes: Object.values(equipements["1"] || []).map((e: any) => ({
//           nom_imprimante: e.nom_equipement,
//           num_serie: e.numero_serie,
//           id_imprimantes: e.id_equipement,
//         })),
//         kits: Object.values(equipements["2"] || []).map((e: any) => ({
//           nom_imprimante: e.nom_equipement,
//           num_serie: e.numero_serie,
//           id_imprimantes: e.id_equipement,
//         })),
//       },
//     };
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// onMounted(() => {
//   loadData();
// });
</script>

<template>
  <div class="w-full h-full flex flex-col items-center mt-10">
    <Enregistrement type-operation="2" />
  </div>
</template>
