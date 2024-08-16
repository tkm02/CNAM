<template>
  <div>
    <div v-if="!signatureDataUrl">
      <canvas
        ref="canvas"
        width="180"
        height="100"
        style="border: 1px solid black;"
      ></canvas>
      <button @click="clearCanvas" class="mr-4">Effacer</button>
      <button @click="saveSignature">Sauvegarder</button>
    </div>
    <div v-else>
      <img :src="signatureDataUrl" alt="Signature" width="180" height="100" style="border: 1px solid black;" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useDataStore } from '@/stores/dataStore';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const signatureDataUrl = ref<string | null>(null);

const dataStore = useDataStore();
const tokenStore = useTokenStore()

const getEventPosition = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    return { offsetX: event.offsetX, offsetY: event.offsetY };
  } else if (event instanceof TouchEvent && canvas.value) {
    const rect = canvas.value.getBoundingClientRect();
    const touch = event.touches[0];
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  }
  return { offsetX: 0, offsetY: 0 };
};

const startDrawing = (event: MouseEvent | TouchEvent) => {
  if (ctx.value) {
    isDrawing.value = true;
    const { offsetX, offsetY } = getEventPosition(event);
    ctx.value.beginPath();
    ctx.value.moveTo(offsetX, offsetY);
  }
};

const draw = (event: MouseEvent | TouchEvent) => {
  if (ctx.value && isDrawing.value) {
    const { offsetX, offsetY } = getEventPosition(event);
    ctx.value.lineTo(offsetX, offsetY);
    ctx.value.stroke();
  }
};

const stopDrawing = () => {
  if (ctx.value) {
    isDrawing.value = false;
    ctx.value.closePath();
  }
};

const clearCanvas = () => {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value?.width || 0, canvas.value?.height || 0);
  }
};

const saveSignature = () => {
  if (canvas.value) {
    signatureDataUrl.value = canvas.value.toDataURL('image/png');
    if (tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 3) {
      dataStore.collectedData.signature_chef = signatureDataUrl.value;
    } else if (tokenStore.getDataInfo.valid_roles_and_sites[0].role_id === 2) {
      dataStore.collectedData.signature_superviseur = signatureDataUrl.value;
    }
    console.log(signatureDataUrl.value);
    
  }
};

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    if (ctx.value) {
      ctx.value.strokeStyle = 'black';
      ctx.value.lineWidth = 2;
      canvas.value.addEventListener('mousedown', startDrawing);
      canvas.value.addEventListener('mousemove', draw);
      canvas.value.addEventListener('mouseup', stopDrawing);
      canvas.value.addEventListener('mouseleave', stopDrawing);

      // Touch events
      canvas.value.addEventListener('touchstart', startDrawing);
      canvas.value.addEventListener('touchmove', draw);
      canvas.value.addEventListener('touchend', stopDrawing);
      canvas.value.addEventListener('touchcancel', stopDrawing);
    }
  }
});
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
</style>
