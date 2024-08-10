<script setup lang="ts">
import { ref, watch } from 'vue'
import { ModalMotifComponent } from "#components";

definePageMeta({
  middleware: "guest",
});

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
const selectedPrinters = ref([...people]);

const mainInputValue = ref(0);
const printerInputValue = ref(0);

const inputValuesArray = ref<number[]>(
  people.map((person) => person.inputValue)
);
const printerInputValuesArray = ref<number[]>(
  people.map((person) => person.inputValue)
);

const activeStep = ref(1);

const showModal = ref(false)
const modalReason = ref('')
const removedItem = ref(null)

watch(selected, (newValue, oldValue) => {
  const removedItems = oldValue.filter(item => !newValue.includes(item))
  if (removedItems.length > 0) {
    removedItem.value = removedItems[0]
    showModal.value = true
  }
}, { deep: true })

watch(selectedPrinters, (newValue, oldValue) => {
  const removedItems = oldValue.filter(item => !newValue.includes(item))
  if (removedItems.length > 0) {
    removedItem.value = removedItems[0]
    showModal.value = true
  }
}, { deep: true })

function closeModal() {
  showModal.value = false
  modalReason.value = ''
}

function submitModal() {
  console.log('Reason submitted for item:', removedItem.value)
  console.log('Reason:', modalReason.value)
  closeModal()
  // Ici, vous pouvez ajouter la logique pour gérer la raison soumise
  // Par exemple, vous pourriez vouloir stocker la raison avec l'élément supprimé
}

function handleChangeInput(array: number[]) {
  mainInputValue.value = array.reduce(
    (sum: number, current: number) => sum + Number(current),
    0
  );
}

function handlePrinterChangeInput(array: number[]) {
  printerInputValue.value = array.reduce(
    (sum: number, current: number) => sum + Number(current),
    0
  );
}
</script>

<template>
  <div v-if="activeStep == 1" class="px-4">
    <Enregistrement />
    <div class="flex justify-end mt-4">
      <UButton label="Suivant" @click="activeStep += 1" />
    </div>
  </div>

  <div class="p-4" v-if="activeStep == 2">
    <div class="grid grid-cols-2 gap-8">
      <!-- Première colonne: Nombre de kits + Tableau des kits -->
      <div>
        <div class="flex items-center space-x-4 mb-4">
          <p>Nombre de kits</p>
          <UInput v-model="mainInputValue" class="w-[70px]" type="number" />
        </div>

        <div>
          <p>Liste des kits</p>
          <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[657px]' }">
            <UTable
              v-model="selected"
              :rows="people"
              :columns="columns"
              :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-[400px]' }"
            >
              <template #actions-data="{ row, index }">
                <UInput
                  type="number"
                  v-model="inputValuesArray[index]"
                  class="w-[70px]"
                  @change="handleChangeInput(inputValuesArray)"
                />
              </template>
            </UTable>
          </UCard>
        </div>
      </div>

      <!-- Deuxième colonne: Nombre d'imprimantes + Tableau des imprimantes -->
      <div>
        <div class="flex items-center space-x-4 mb-4">
          <p>Nombre d'imprimantes</p>
          <UInput
            v-model="printerInputValue"
            class="w-[70px]"
            type="number"
          />
        </div>

        <div>
          <p>Liste des imprimantes</p>
          <UCard :ui="{ body: { padding: 'px-0 py-0 sm:p-0' }, base: 'w-[657px]' }">
            <UTable
              v-model="selectedPrinters"
              :rows="people"
              :columns="columns"
              :ui="{ td: { padding: 'py-1 px-2' }, base: 'min-w-[400px]' }"
            >
              <template #actions-data="{ row, index }">
                <UInput
                  type="number"
                  v-model="printerInputValuesArray[index]"
                  class="w-[70px]"
                  @change="handlePrinterChangeInput(printerInputValuesArray)"
                />
              </template>
            </UTable>
          </UCard>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <UButton label="Suivant" @click="activeStep += 1" />
    </div>
  </div>

  <div v-if="activeStep == 3">
    <FormulaireCamion />
    <div class="flex justify-end mt-4">
      <UButton label="Terminer" @click="activeStep = 1" />
    </div>
  </div>

  <UModal v-model="showModal">
    <UCard>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900">Donnez le motif</h3>
      </template>
      <div class="mt-2">
        <p v-if="removedItem">Motif de suppression pour : {{ removedItem.name }}</p>
        <UTextarea v-model="modalReason" placeholder="Entrez le motif ici" />
      </div>
      <template #footer>
        <div class="mt-4 flex justify-end space-x-2">
          <UButton color="gray" label="Annuler" @click="closeModal" />
          <UButton color="primary" label="Envoyer" @click="submitModal" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>