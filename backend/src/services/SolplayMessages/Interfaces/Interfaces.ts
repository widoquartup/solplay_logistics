export interface StationInfo {
    stationId: number;
    stationType: number;
    level: number;
}

export interface TransportRequest {
    from: StationInfo,
    to: StationInfo;
}

export interface CargaToldoRequest {
    producto: string;
}


