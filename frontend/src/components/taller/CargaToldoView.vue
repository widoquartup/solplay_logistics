<template>
  <v-container class="main-container">
    <div class="focus-line" :class="{ 'focus-line-visible': isInputFocused }"></div>
    <v-row class="input-fields">
      <v-col cols="12">
        <v-text-field v-model="input" label="" id="input_field" @blur="handleBlur" @focus="handleFocus"></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col cols="6" class="text-center tit-left">
        <h2>Izquierda</h2>
        <p class="codigo">{{ product.I }}</p>
      </v-col>
      <v-col cols="6" class="text-center tit-right">
      <h2>Derecha</h2>
        <p class="codigo">{{ product.D }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="d-flex justify-center ">
        <v-card width="100%" class="info-zone left-zone" :class="{ 'blink-animation': isLeftBlinking }"
          :style="leftZoneStyle" aria-live="polite" role="status">
          <v-card-text class="text-center card-product-info">
            <h3 class="text-left" v-html="leftProductInfo"></h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="d-flex justify-center ">
        <v-card width="100%" class="info-zone right-zone" :class="{ 'blink-animation': isRightBlinking }"
          :style="rightZoneStyle" aria-live="polite" role="status">
          <v-card-text class="text-center card-product-info">
            <h3 class="text-left" v-html="rightProductInfo"></h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-list dense class="product-list left">
          <v-list-item v-for="(item, index) in leftProductList.slice(0, 10)" :key="index">
            {{ item }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <v-list dense class="product-list right">
          <v-list-item v-for="(item, index) in rightProductList.slice(0, 10)" :key="index">
            {{ item }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top"
      :style="{ 'z-index': 1000 }">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeMount } from 'vue';
import PendingStorageService from '@/services/PendingStorageService';

onBeforeMount(() => {
  document.title = 'SOLPLAY TALLER';
});

const focusCheckInterval = ref(null);
const input = ref('');
const product = ref({ I: '', D: '' });
const leftProductInfo = ref('');
const rightProductInfo = ref('');
const leftProductList = ref([]);
const rightProductList = ref([]);
const snackbar = ref({ show: false, text: '', color: 'info' });
const isLoading = ref(false);
const isLeftBlinking = ref(false);
const isRightBlinking = ref(false);
const isInputFocused = ref(false);

const leftBaseColor = 'rgb(239, 212, 212)';
const rightBaseColor = 'rgb(189, 230, 188)';

const leftZoneColor = computed(() => leftBaseColor);
const rightZoneColor = computed(() => rightBaseColor);

const darkenColor = (color) => {
  const rgb = color.match(/\d+/g);
  return `rgb(${rgb.map(c => Math.max(0, parseInt(c) - 30)).join(', ')})`;
};

const leftZoneStyle = computed(() => ({
  backgroundColor: leftZoneColor.value,
  '--blink-color': darkenColor(leftZoneColor.value)
}));

const rightZoneStyle = computed(() => ({
  backgroundColor: rightZoneColor.value,
  '--blink-color': darkenColor(rightZoneColor.value)
}));

const activateColorTransition = (zone) => {
  if (zone === 'left') {
    isLeftBlinking.value = true;
    setTimeout(() => { isLeftBlinking.value = false; }, 1500);
  } else if (zone === 'right') {
    isRightBlinking.value = true;
    setTimeout(() => { isRightBlinking.value = false; }, 1500);
  }
};

const saveToLocalStorage = () => {
  localStorage.setItem('leftProductList', JSON.stringify(leftProductList.value));
  localStorage.setItem('rightProductList', JSON.stringify(rightProductList.value));
};

const showSnackbar = (text, color) => {
  snackbar.value = { show: true, text, color };
};

const loadFromLocalStorage = () => {
  const leftList = localStorage.getItem('leftProductList');
  const rightList = localStorage.getItem('rightProductList');
  if (leftList) leftProductList.value = JSON.parse(leftList);
  if (rightList) rightProductList.value = JSON.parse(rightList);
};

const handleFocus = () => {
  isInputFocused.value = true;
};

const handleBlur = (event) => {
  isInputFocused.value = false;
  handleInput(event);
};

const handleInput = async (event) => {
  resetFocusCheck();
  const value = String(event.target.value).toUpperCase();
  input.value = '';
  event.target.focus();
  const firstChar = value.charAt(0);

  // YA NO ESCANEAMOS EL OK
  // if (value === 'IOK' && leftProductInfo.value) {
  //   sendData(firstChar)
  //   return;
  // }
  // if (value === 'DOK' && rightProductInfo.value) {
  //   sendData(firstChar)
  //   return;
  // }
  // if (value === 'DOK' || value === 'IOK') {
  //   return;
  // }

  product.value[firstChar] = value.slice(1);
  const ofSplit = product.value[firstChar].split('.')
  console.log("firstChar", firstChar);
  if (ofSplit.length === 6) {
    const productInfo = `OF: ${ofSplit[2]} ` + "<br>" +
      `${ofSplit[1]}` + "<br>" +
      `Bulto: ${ofSplit[5]}` + "<br>" +
      `Total: ${ofSplit[3]}` ;

    if (firstChar === 'I') {
      leftProductInfo.value = productInfo;
      activateColorTransition('left');
      sendData(firstChar)
      
    } else if (firstChar === 'D') {
      rightProductInfo.value = productInfo;
      activateColorTransition('right');
      sendData(firstChar)
    }
  }
};

const sendData = async (firstChar) => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const station_type = firstChar === 'I' ? 1 : 3;

    if (station_type !== '' && product.value[firstChar] !== '') {
      const response = await PendingStorageService.submitCargaToldo(station_type, product.value[firstChar]);
      console.log("RESPONSE", response)
      if (response.data == null && response.error) {
        showSnackbar(response.error, 'error');
        return;
      }
      refreshScreenAndStorage(firstChar);
    }
  } catch (error) {
    console.error('Error al enviar datos de carga de toldo:', error);
    showSnackbar('Error al enviar datos', 'error');
  } finally {
    isLoading.value = false;
  }
};

const startFocusCheck = () => {
  focusCheckInterval.value = setInterval(() => {
    if (!isInputFocused.value) {
      document.getElementById("input_field").focus();
    }
  }, 5000);
};

const resetFocusCheck = () => {
  clearInterval(focusCheckInterval.value);
  startFocusCheck();
};

const refreshScreenAndStorage = (firstChar) => {
  if (firstChar === 'I') {
    product.value.I = '';
    leftProductList.value.unshift(leftProductInfo.value.replace(/<br>/g, ' / '));
    leftProductList.value = leftProductList.value.slice(0, 10);
    leftProductInfo.value = '';
  }
  if (firstChar === 'D') {
    product.value.D = '';
    rightProductList.value.unshift(rightProductInfo.value.replace(/<br>/g, ' / '));
    rightProductList.value = rightProductList.value.slice(0, 10);
    rightProductInfo.value = '';
  }
  saveToLocalStorage();
}

onMounted(() => {
  startFocusCheck();
  loadFromLocalStorage();
  input.value = '';
  document.getElementById("input_field").focus();
});

onUnmounted(() => {
  clearInterval(focusCheckInterval.value);
});
</script>

<style scoped>
.info-zone {
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.left-zone,
.right-zone {
  transition: background-color 0.3s ease;
  min-height: 16vh;
}

.left-zone .v-card-text,
.right-zone .v-card-text {
  color: rgb(34, 31, 31);
}
.left-zone h3, .right-zone h3 {
  font-size: 2.5em;
}

@media (max-width: 2000px) {
  .left-zone h3, .right-zone h3 {
    font-size: 2em;
  }
  .info-zone {
    width: 100% !important;
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 1200px) {
  .left-zone h3, .right-zone h3 {
    font-size: 1.25em !important;
    line-height: 1.75em !important;
  }
  .info-zone {
    width: 100% !important;
    margin-bottom: 1.5rem;
  }
  .product-list{
    font-size: 1em !important;
    line-height: 1.25em !important;
  }
}
@media (max-width: 600px) {
  .left-zone h3, .right-zone h3 {
    font-size: 0.90em !important;
    line-height: 1.75em !important;
  }
  .info-zone {
    width: 100% !important;
    margin-bottom: 1.5rem;
  }
  .product-list{
    font-size: 0.80em !important;
    line-height: 1.05em !important;
  }
}

.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

.v-btn:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  0%,
  100% {
    background-color: var(--current-color);
  }

  50% {
    background-color: var(--blink-color);
  }
}

.blink-animation {
  --current-color: inherit;
  animation: blink 0.5s 3;
}

.mdi-loading {
  animation: spin 1s linear infinite;
}

.card-without-shadow {
  box-shadow: none !important;
}

.btn-carga-toldo {
  font-size: 2em;
  line-height: 2em;
  padding: 20px;
  min-height: fit-content;
  height: fit-content;
  color: white;
}

.v-card {
  margin: 0 auto;
}

.card-product-info h3 {
  width: auto !important;
}

.card-product-info {
  margin: auto !important;
  padding: 1em !important;
}

.product-list {
  height: 300px;
  background-color: #fafafa;
  overflow-y: auto;
  border-radius: 4px;
}

.v-col{
  padding: 4px;
}

.main-container{
  margin: 10px;
  max-width: -webkit-fill-available;
}

.input-fields{
  max-height: 0px;
  overflow: hidden;
}
.codigo{
  height: 25px;
  line-height: 25px;
}

.focus-line {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: orange; /* Color naranja cuando no tiene el foco */
  opacity: 1; /* Siempre visible */
  transition: background-color 0.3s ease;
}

.focus-line-visible {
  background-color: green; /* Cambia a verde cuando tiene el foco */
  animation: blink-line 1s infinite;
}

@keyframes blink-line {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.left-zone, .product-list.left{
  margin-right:10px;
}
.right-zone, .product-list.right{
  margin-left:10px;
}

</style>