// src/stores/websocketStore.js
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { useStationStore } from './stationsStore' // Importamos el store
import { useCompletedOrdersStore } from './completedOrdersStore';
import { useConnectionStore } from './connectionStore';
import { useMessageQueueStore } from './messageQueueStore';


const VITE_SOCKET_EVENT_STORE_CHANGED = import.meta.env.VITE_SOCKET_EVENT_STORE_CHANGED || 'store_hanged';
const VITE_SOCKET_CONNECTION_STATUS = import.meta.env.VITE_SOCKET_CONNECTION_STATUS || 'connection_status';
const VITE_SOCKET_MESSAGE_QUEUE_STATUS = import.meta.env.VITE_SOCKET_MESSAGE_QUEUE_STATUS || 'message_queue_changed';
// console.log("VITE_SOCKET_EVENT_STORE_CHANGED", VITE_SOCKET_EVENT_STORE_CHANGED);
export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    socket: null,
    isConnected: false,
    messages: [],
  }),

  actions: {
    initializeSocket() {
      this.socket = io(import.meta.env.VITE_SOLPLAY_SOCKET_URL );

      this.socket.on('connect', () => {
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      // Manejador genérico para todos los eventos
      this.socket.onAny((eventName, ...args) => {
        this.processMessage(eventName, args[0]); // Asumimos que el primer argumento es el mensaje
      });
    },  

    sendMessage(message) {
      if (this.socket && this.isConnected) {
        this.socket.emit('mensaje', message);
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }
    },

    handleNewMessage(message) {
      this.processMessage(message);
    },
    
    
    processMessage(event, message) {
      console.log(`Mensaje recibido ${event}, actualizando estaciones:`,message); 
      
      
      // ha cambiado el store
      if (event == VITE_SOCKET_EVENT_STORE_CHANGED ){
        this.storeChanged()
        return;
      }

      // recibimos el estado de la conexión con el gateway
      if (event == VITE_SOCKET_CONNECTION_STATUS ){
        this.gatewayConectionChanged(message)
        return;
      }
      // recibimos el estado de la conexión con el gateway
      if (event == VITE_SOCKET_MESSAGE_QUEUE_STATUS ){
        this.messageQueueChanged(message)
        return;
      }
    },
    
    messageQueueChanged(){
      const messageQueueStore = useMessageQueueStore();
      messageQueueStore.fetchMessages();
    },
    
    storeChanged() {
      const stationsStore = useStationStore();
      const completedOrdersStore = useCompletedOrdersStore();

      stationsStore.getStations();
      completedOrdersStore.fetchCompletedOrders();
      // try {
      //   const stationMessage = JSON.parse(message);
      //   console.log('>>>>>> '+VITE_SOCKET_EVENT_STORE_CHANGED, message, stationMessage);
      //   stationsStore.updateStation(stationMessage)
       
      // } catch (error) {
      //   console.log("ERROR",error)
      // }
      // stationsStore.getStations();
    },

    gatewayConectionChanged(message){
      const connectionStore = useConnectionStore();
      const statusMessage = JSON.parse(message);
      console.log("STATUS CONNECTED", statusMessage, message)
      connectionStore.setStatusConnected(statusMessage.connected)

    }


  },
});

