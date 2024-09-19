<template>
  <ConnectionStatus />
  <div class="warehouse-container">
    <div class="fixed-station station100">
      <station v-if="stationStore.stations.carga"  :station-data="stationStore.stations.carga" station-name="Carga" @position-click="handlePositionClick"
        @position-context="handlePositionContext" />
    </div>
    <div class="scrollable-stations scroll-container" ref="scrollableStations" @mousedown="startDrag" @mousemove="debouncedDrag" id="scrollContainer"  @mouseup="endDrag" @mouseleave="endDrag">
      <div class="scroll-content">
        <div class="warehouse" v-if="stationStore.stations.almacen.length > 0">
          <Station v-for="item in stationStore.stations.almacen" :key="item[0].station_id" :station-data="item"
            :station-name="item[0].station_id.toString()" @position-click="handlePositionClick"
            @position-dblclick="handlePositionDblClick" @position-context="handlePositionContext" />
        </div>
      </div>
    </div>
    <div class="fixed-station">
      <station :station-data="stationStore.stations.entrega" station-name="Entrega" :is-entrega="true"
        :is-entrega-transition="isEntregaTransition" @position-click="handlePositionClick" />
    </div>
  </div>
  <v-dialog v-model="orderDialog" max-width="400px">
    <v-card v-if="selectedOrder">
      <v-card-text>
        <v-container>
          <v-row v-for="(value, key) in selectedOrder" :key="key">
            <v-col cols="12">
              <p class="mb-0"><b>{{ formatLabel(key) }}:</b> {{ formatValue(key, value) }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-alert v-else type="info" dense>
      No hay información de pedido disponible para esta posición.
    </v-alert>
  </v-dialog>

  <Visualizador :isTransport="isTransport" @changeTransportFunction="handleChangeTransportFunction" @handleDelivery="handleDelivery" @simulateCarga="simulateCarga" @cancelTransit="cancelTransit" @resetApiGateway="resetApiGateway" />

  <!-- <v-textarea v-model="jsonOutput" readonly rows="10" class="mt-4"></v-textarea> -->
  <v-snackbar v-model="snackbar" :timeout="3000">
    {{ snackbarText }}
  </v-snackbar>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title>Confirmación</v-card-title>
      <v-card-text>{{ confirmationMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="handleUnloadConfirmation(true)">OK</v-btn>
        <v-btn color="red darken-1" text @click="handleUnloadConfirmation(false)">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Station from './Station.vue'

import transportService from '../../services/AlmacenService'
import { LEVEL_ORDER_POSITIONS, useStationStore, MAX_STATIONS_STORE } from '../../stores/stationsStore' // Importamos el store
import { useWebSocketStore } from '@/stores/websocketStore';
import Visualizador from './Visualizador.vue';
import ConnectionStatus from './ConnectionStatus.vue';


const dialog = ref(false)
const confirmationMessage = ref('')
// Usamos el store
const stationStore = useStationStore()
// Estado reactivo para los datos de las estaciones
// const ordenesListado = computed(() => stationStore.stations.almacen);


// Referencias reactivas y estados
const firstClick = ref(null)
const unloadTo = ref(null)
const transportInfo = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const orderDialog = ref(false)
const selectedOrder = ref(null)
const transitOrder = ref(null)
const isEntregaTransition = ref(false)

const isTransport = ref(true);

// Salida JSON computada        
function handleChangeTransportFunction(){
  isTransport.value = !isTransport.value;
}


// const jsonOutput = computed(() => JSON.stringify(stationStore.stations, null, 2))
const websocketStore = useWebSocketStore();


onMounted(async () => {
  document.addEventListener('scroll', preventBodyScroll, { passive: false })
  await useStationStore().getStations();
  websocketStore.initializeSocket();
  // initializeStationData();
})

onUnmounted(() => {
  document.removeEventListener('scroll', preventBodyScroll)
  websocketStore.disconnect();
})



// Maneja el doble clic en una posición
function handlePositionDblClick(station, position, order) {
  if (order) {
    selectedOrder.value = order
    orderDialog.value = true
  } else {
    showSnackbar('No hay pedido en esta posición')
  }
}

// Formatea la fecha para su visualización
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const options = { dateStyle: 'short' }
  return date.toLocaleString('en-US', options)
}

// Formatea las etiquetas para el diálogo de orden
function formatLabel(key) {
  const labels = {
    orderNumber: 'Número de Orden',
    position: 'Posición',
    expeditionDate: 'Fecha de Expedición',
    finished: 'Finalizado'
  }
  return labels[key] || key
}

// Formatea los valores para el diálogo de orden
function formatValue(key, value) {
  if (key === 'expeditionDate') {
    return formatDate(value)
  }
  if (key === 'finished') {
    return value ? 'Sí' : 'No'
  }
  return value
}

const getIndexPosition = (station, position) => {
  // return parseInt(position.substring(0,1));
  console.log("getIndexPosition", station, position)
  // Si es entrega no importa la posición
  if (station == 'entrega') {
    return -1;
  }
  // Si es carga son solo 2 índices
  if (station == 'carga') {
    return (position + '').substring(0, 1) == '3' ? 0 : 1;
    // return  position.substring(0,1)=='D' ? 0 : 1;
  }
  // Para el resto de estaciones hay 4 posiciones.
  return LEVEL_ORDER_POSITIONS.findIndex(i => i == position);
}



// Maneja el clic en una posición
function handlePositionClick(station, position) {
  station = station.toLowerCase()
  console.log("Station:", station, "Position:", position, "firstClick.value", firstClick.value)
  var indexPosition = getIndexPosition(station, position);

  const posData = getPositionData(station, indexPosition)
  console.log("PosData:", posData)

  if (!firstClick.value) {
    handleFirstClick(station, indexPosition, posData)
  } else {
    handleSecondClick(station, indexPosition, posData)
  }
}

// Obtiene los datos de una posición específica
function getPositionData(station, indexPosition) {
  if (station == 'entrega') {
    return stationStore.stations.entrega;
  }
  if (station == 'carga') {
    return stationStore.stations.carga[indexPosition];
  }
  return stationStore.stations.almacen[station - 1][indexPosition];
}

// Maneja el primer clic (selección de origen) 
function handleFirstClick(station, indexPosition, posData) {
  console.log("handleFirstClick", station, indexPosition, posData)
  if (canSelectAsOrigin(station, indexPosition, posData)) {
    if (station === 'carga') {
      firstClick.value = { station, position: indexPosition == 1 ? 1 : 3 };
      // firstClick.value = { station, position: indexPosition==1 ? 'I': 'D'};
      transitOrder.value = stationStore.stations[station][indexPosition].order;
    } else {
      firstClick.value = { station, position: LEVEL_ORDER_POSITIONS[indexPosition] };
      // firstClick.value = { station, position: LEVEL_ORDER_POSITIONS[indexPosition]};
      transitOrder.value = posData.order
    }
    showSnackbar('¿A qué estación deseas enviar la carga?')
    return;
  }
  if (station == 'carga' || station == 'entrega') {
    return;
  }
  // No se ha enviado a cargar nada, hacemos que el carro descargue si tiene algo, o simule una descarga
  console.log("Descargar en ", station, indexPosition)
  unloadTo.value = { station, position: LEVEL_ORDER_POSITIONS[indexPosition] }
  showSnackbar('Esta posición no tiene carga para enviar o no está operativa.')
  confirmationMessage.value = '¿Deseas descargar en esta posición?'
  dialog.value = true
}

async function handleUnloadConfirmation(confirmed) {
  console.log("Unload Confirmation", confirmed, unloadTo.value)
  dialog.value = false
  if (confirmed) {
    const to = { station: unloadTo.value.station, position: unloadTo.value.position }
    unloadTo.value = null;
    const response = await transportService.unload(to)
    console.log("Respuesta OK:", response)
    showTransportInfo('Se ha enviado la información al carro con éxito.')
    console.log('Descargando en la posición')
    // Aquí puedes agregar la lógica necesaria para la descarga
  } else {
    // console.log('Descarga cancelada')
  }
}

// Verifica si una posición puede ser seleccionada como origen
function canSelectAsOrigin(station, indexPosition, posData) {
  console.log("canSelectAsOrigin", station, indexPosition, posData)
  if (station === 'carga') {
    // let indexPosition = position.substring(0,1)=='D' ? 0 : 1;
    return posData.loaded && posData.status_ok
  } else if (station !== 'entrega') {
    return posData.loaded && posData.status_ok
  }
  return false
}

// Maneja el segundo clic (selección de destino)
function handleSecondClick(station, indexPosition, posData) {
  console.log("handleSecondClick", station, indexPosition, posData)
  if (station === 'entrega') {
    handleTransportToEntrega()
  } else if (station !== 'carga' && posData.status_ok && !posData.loaded) {
    handleTransportToStation(station, indexPosition)
  } else {
    showSnackbar('Selección de destino no válida. Intenta de nuevo.')
  }
}

function handleDelivery(from){
  firstClick.value = from;
  handleTransportToEntrega() 
}


// Maneja el transporte a la estación de entrega
function handleTransportToEntrega() {
  isEntregaTransition.value = true
  clearOriginPosition()
  const from = { station: firstClick.value.station, position: firstClick.value.position }
  const to = { station: 'entrega', position: null }
  registerTransport(from, to)
  showTransportInfo(`Transporte registrado: desde ${from.station}:${from.position} hasta Entrega`)
  resetFirstClick()

  setTimeout(() => {
    isEntregaTransition.value = false
  }, 600)
}

// Maneja el transporte a una estación normal
function handleTransportToStation(station, indexPosition) {

  updateStationData(station, indexPosition, true, transitOrder.value)
  const from = { station: firstClick.value.station, position: firstClick.value.position }
  const to = { station, position: LEVEL_ORDER_POSITIONS[indexPosition] }
  clearOriginPosition()
  if (isTransport.value){
    registerTransport(from, to)
    showTransportInfo(`Transporte registrado: desde ${from.station}:${from.position} hasta ${to.station}:${to.position}`)
  }else{
    registerMoveOrder(from, to)
    showTransportInfo(`Moviendo una orden en la base de datos: desde ${from.station}:${from.position} hasta ${to.station}:${to.position}`)
  }
  resetFirstClick()
}

// Limpia la posición de origen después de un transporte
function clearOriginPosition() {
  const { station, position } = firstClick.value
  console.log("CLEAR:", station, position)
  updateStationData(station, getIndexPosition(station, position), false, null)
}

// Actualiza los datos de una estación
function updateStationData(station, indexPosition, loaded, order) {
  console.log("updateStationData", station, indexPosition, loaded, order)
  if (station === 'carga') {
    stationStore.stations.carga[indexPosition].loaded = loaded
    stationStore.stations.carga[indexPosition].order = order
  } else {
    stationStore.stations.almacen[station - 1][indexPosition].loaded = loaded
    stationStore.stations.almacen[station - 1][indexPosition].order = order
  }
}

// Resetea el primer clic
function resetFirstClick() {
  firstClick.value = null
  transitOrder.value = null
}

// Muestra información de transporte
function showTransportInfo(message) {
  transportInfo.value = message
}

// Muestra un mensaje en el snackbar
function showSnackbar(message) {
  snackbarText.value = message
  snackbar.value = true
}

// Registra un transporte en el servicio
async function cancelTransit() {
  console.log("Cancelando tránsito")
  try {
    const response = await transportService.cancelTransit()
    console.log("Respuesta OK:", response)
    showTransportInfo('Se ha enviado la información al carro con éxito.')
    return true
  } catch (error) {
    console.error("Error al cancelar tránsito:", error)
    showSnackbar('Error al cancelar el tránsito. Por favor, inténtelo de nuevo.' + error.toString())
    return false
  }
}
// Registra un transporte en el servicio
async function registerTransport(from, to) {
  console.log("Llamando a API con valores:", from, to)
  try {
    const response = await transportService.registerTransport(from, to)
    console.log("Respuesta OK:", response)
    showTransportInfo('Se ha enviado la información al carro con éxito.')
    return true
  } catch (error) {
    console.error("Error al registrar el transporte:", error)
    showSnackbar('Error al registrar el transporte. Por favor, inténtelo de nuevo.')
    return false
  }
}

// Registra un transporte en el servicio
async function registerMoveOrder(from, to) {
  console.log("Llamando a API con valores:", from, to)
  try {
    const response = await transportService.registerMoveOrder(from, to)
    console.log("Respuesta OK:", response)
    showTransportInfo('Se ha movido la orden en la BBDD')
    return true
  } catch (error) {
    console.error("Error al registrar el transporte:", error)
    showSnackbar('Error al registrar el transporte. Por favor, inténtelo de nuevo.')
    return false
  }
}

// Maneja el clic derecho en una posición
function handlePositionContext(station, position, order) {
  console.log("Station:", station, "Position:", position, "Order:", order)
  var indexPosition = getIndexPosition(station, position);

  const stationNumber = parseInt(station)
  if ((station.toLowerCase() === 'carga' || (stationNumber >= 1 && stationNumber <= MAX_STATIONS_STORE)) && !order) {
    const newOrder = generateRandomOrder(position)
    updateStationData(station.toLowerCase(), indexPosition, true, newOrder)
    showSnackbar(`Se han generado datos aleatorios para la posición ${position} de la estación ${station}`)
  } else if (order) {
    selectedOrder.value = order
    orderDialog.value = true
  } else {
    showSnackbar('No hay pedido en esta posición')
  }
}

// Genera una orden aleatoria
function generateRandomOrder(position) {
  return {
    orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
    position: position,
    expeditionDate: new Date(),
    finished: Math.random() < 0.5
  }
}

// Simula la carga en una posición
function simulateCarga(position) {
  console.log("simulateCarga1", position)
  const order = generateRandomOrder(position)
  updateStationData('carga', getIndexPosition("carga", position), true, order)
  showSnackbar(`Carga simulada en posición ${position} de la estación de carga`)
}

// Lógica para el arrastre (drag) de la vista
const scrollableStations = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

function startDrag(e) {
  isDragging.value = true
  startX.value = e.pageX - scrollableStations.value.offsetLeft
  scrollLeft.value = scrollableStations.value.scrollLeft
}

// Implementación de debounce para optimizar el rendimiento del arrastre
const debouncedDrag = debounce(drag, 10)

function drag(e) {
  if (!isDragging.value) return
  e.preventDefault()
  const x = e.pageX - scrollableStations.value.offsetLeft
  const walk = (startX.value - x)
  scrollableStations.value.scrollLeft = scrollLeft.value + walk
}

function endDrag() {
  isDragging.value = false
}

// Función de debounce para optimizar el rendimiento
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Previene el scroll del body mientras se arrastra
function preventBodyScroll(e) {
  if (isDragging.value) {
    e.preventDefault()
  }
}

async function resetApiGateway() {
  try {
    const response = await transportService.reset_api_gateway()
    console.log("API Reset Response:", response)
    showSnackbar('API Gateway ha sido reiniciado con éxito.')
  } catch (error) {
    console.error("Error al reiniciar API Gateway:", error)
    showSnackbar('Error al reiniciar API Gateway. Por favor, inténtelo de nuevo.')
  }
}



</script>

<style scoped>
.station100 {
  margin-top: 5px;
}

.warehouse-container {
  display: flex;
  padding: 20px 20px 0 20px;
  width: 100%;
  overflow: hidden;
  height: 340px;
  display: inline-flex;
}

.fixed-station {
  flex: 0 0 110px;
  min-width: 120px !important;
}
.scrollable-stations {
  /* flex: 1; */
  overflow-x: auto;
  white-space: nowrap;
  cursor: grab;
  user-select: none;
}

.scrollable-stations:active {
  cursor: grabbing;
}

.warehouse {
  display: inline-flex;
  gap: 10px;
}

.transport-info {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}

/* Estilos para la barra de scroll */
.scrollable-stations::-webkit-scrollbar {
  height: 40px;
}

.scrollable-stations::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-stations::-webkit-scrollbar-thumb {
  background: rgba(255, 217, 1, 0.6773);
  border-radius: 5px;
}

.scrollable-stations::-webkit-scrollbar-thumb:hover {
  background: rgb(255, 213, 1);
}


.scroll-container {
  /* width: 90vw; */
  /* width:  80vh; */
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
}

.scroll-content {
  display: inline-flex;
}
</style>