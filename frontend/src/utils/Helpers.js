export const stationTypeToNumber = (stationType) => {
  const stationTypeMap = {
    'D': 3,
    'I': 1
  };
  return typeof stationType === 'number' ? stationType : stationTypeMap[stationType] || null;
};


export function formatStationId(station_id) {
  console.log("Station_id", station_id)
  return station_id == 100 ? "Carga" : station_id.toString();
}

export function formatDateFromString(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export function formatDate(date) {
  console.log("DATE MQ", typeof date, date)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString(undefined, options)
}

export function getStationTypeString(stationType){
  return stationType==3 ? "Derecha" : "Izquierda";
}
export function getStationLevelString(level){
  return level==2 ? "Interior" : "Exterior";
}

// ordena un array por el campo createdAt y asigna el nro de orden a cada línea
export function sortAndNumberArray(arr) {
  // Primero, ordenamos el array por la propiedad createdAt
  const sortedArr = arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  // Luego, añadimos el número de orden a cada elemento
  return sortedArr.map((item, index) => ({
    ...item,
    orderNumber: index + 1
  }));
}