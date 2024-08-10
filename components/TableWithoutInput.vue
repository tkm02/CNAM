<script setup lang="ts">
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

const showModal = useModal();
const mainInputValue = ref(0);
const inputValuesArray = ref<number[]>(
  people.map((person) => person.inputValue)
);
const activeStep = ref(1);

// function handleChangeInput(count:number){
//     mainInputValue.
// }

watch(
  () => selected.value,
  (newSelected, oldSelected) => {
    console.log("Sélection actuelle:", newSelected);
    console.log("Sélection précédente:", oldSelected);

    const deselectedItems = oldSelected.filter(
      (item) => !newSelected.includes(item)
    );

    mainInputValue.value = newSelected.length;
    console.log("Valeur mise à jour de mainInputValue:", mainInputValue.value);
  },
  { deep: true }
);

onMounted(() => {
  mainInputValue.value = selected.value.length;
});
</script>

<template>
  <div class="flex items-center space-x-4">
    <p>Nombre de kits</p>
    <UInput v-model="mainInputValue" class="w-[70px]" type="number" disabled />
  </div>

  <div class="mt-4">
    <p>Liste des kits</p>
    <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[570px]' }">
      <UTable
        v-model="selected"
        :rows="people"
        :columns="columns"
        :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-[400px]' }"
      >
      </UTable>
    </UCard>
  </div>
</template>
