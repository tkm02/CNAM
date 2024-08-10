<script setup lang="ts">
import ModalMotifComponent from "~/components/ModalMotifComponent.vue";

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "actions",
  },
];

const people = [
  {
    id: 1,
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
    inputValue: 0,
  },
  {
    id: 2,
    name: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    role: "Admin",
    inputValue: 0,
  },
  {
    id: 3,
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    role: "Member",
    inputValue: 0,
  },
  {
    id: 4,
    name: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    role: "Admin",
    inputValue: 0,
  },
  {
    id: 5,
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    role: "Owner",
    inputValue: 0,
  },
  {
    id: 6,
    name: "Floyd Miles",
    title: "Principal Designer",
    email: "floyd.miles@example.com",
    role: "Member",
    inputValue: 0,
  },
];

const selected = ref([...people]);

const previousSelected = ref([...people]);

// Utilisez votre méthode pour afficher la modal
const showModal = useModal();
const mainInputValue = ref(0);
const inputValuesArray = ref<number[]>(
  people.map((person) => person.inputValue)
);




function handleChangeInput(array: number[]) {
  mainInputValue.value = array.reduce((sum: number, current: number) => sum + Number(current), 0)
}

watch(selected, (newSelected, oldSelected) => {
  console.log('Sélection actuelle:', newSelected);
  console.log('Sélection précédente:', oldSelected);

  // Détecter les éléments décochés
  const deselectedItems = oldSelected.filter((item, index) => !newSelected.includes(item));
  if (deselectedItems.length > 0) {
    alert('Vous avez décoché un ou plusieurs éléments.');
  }
}, { deep: true });

// Synchroniser les inputValue avec mainInputValue
// watch(mainInputValue, (newValue, oldValue) => {
//   console.log(mainInputValue);
//   if (newValue > 0) {
//     people.map((person) => {
//       inputValuesArray.value = people.map((person) => person.inputValue);
//       console.log(person.inputValue);
//     });
//   }
// });
</script>
<template>

    <Enregistrement/>
    <LoginForm/>

  <div class="p-4">
    <div class="flex items-center space-x-4">
      <p>Nombre de kits</p>
      <UInput v-model="mainInputValue" />
    </div>

    <div class="mt-4">
      <p>Liste des kits</p>
      <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' } }">
        <UTable v-model="selected" :rows="people" :columns="columns">
          <template #actions-data="{ row, index }">
            <UInput v-model="inputValuesArray[index]" @change="handleChangeInput(inputValuesArray)" />
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>
