import transportService from '../services/AlmacenService'
import { defineStore } from 'pinia'

export const MAX_STATIONS_STORE = 64;
export const LEVEL_ORDER_POSITIONS = ['3:2', '3:1', '1:1', '1:2'];
// export const LEVEL_ORDER_POSITIONS = ['D:2', 'D:1', 'I:1', 'I:2'];

const getStation = (data, station_id, station_type, level) => {
  const stationFound = data.find(station => station_id == station.station_id && station_type == station.station_type && level == station.level);
  return stationFound

}

const initStationsData = (data) => {
  const cargaD = getStation(data, 100, 3, 3);
  const cargaI = getStation(data, 100, 1, 3);
  console.log("cargaI", cargaI);
  const retData = {
    carga: [
      cargaD, cargaI
    ],
    almacen: [],
    entrega: { station_ok: true, loaded: false }
  }
  for (let i = 1; i <= MAX_STATIONS_STORE; i++) {
    retData.almacen.push([]);
    ['D:2:3', 'D:1:2', 'I:1:0', 'I:2:1'].forEach(async pos => {
      const [stationType, level, index] = pos.split(':')
      const stationTypeNumber = stationType === 'I' ? 1 : 3
      let station = getStation(data, i, stationTypeNumber, level)

      retData.almacen[i - 1].push(station);
    })
  }
  return retData;
}


export const useStationStore = defineStore('stationsStore', {
  state: () => ({
    stations: {
      carga: [
        { station_id: 100, station_type: 3, status_ok: true, level: 0, loaded: false, record: null, order: null },
        { station_id: 100, station_type: 1, status_ok: true, level: 0, loaded: false, record: null, order: null }
      ],
      almacen: [],
      entrega: { station_ok: true, loaded: false }
    },
  }),
  actions: {
    async getStations() {
      const response = await transportService.getStations();
      if (response && response.collection && response.collection.length > 0) {
        this.stations = initStationsData(response.collection);
      }
    },
    updateStation(stationData) {
      if (stationData.station_id === 100) {
        const index = this.stations.carga.findIndex(station => station.station_type === stationData.station_type);
        console.log("updateStation(stationData)2 ", stationData.station_id,index, stationData, this.stations.carga);
        if (index > -1) {
          console.log("INDEX stationType:100", this.stations.carga[index]);
          this.stations.carga[index].order = stationData.order;
        }
        return
      }
      for (let i = 0; i < this.stations.almacen.length; i++) {
        const index = this.stations.almacen[i].findIndex(station => station._id === stationData._id);
        if (index !== -1) {
          this.stations.almacen[i][index] = { ...this.stations.almacen[i][index], ...stationData };
          break;
        }
      }
    }
  }
})
