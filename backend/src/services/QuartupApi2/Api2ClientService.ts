import axios, { AxiosInstance, AxiosError } from 'axios';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { CargaToldoResultDataType } from '@src/app/Resources/PendingStorage/PendingStorageType';
import { getWeekAgoAnsiDate } from '../SolplayMessages/helpers/Helpers';

dotenv.config();

interface Token {
    token: string;
    refreshToken: string;
}
interface ResultDataType {
    error: string | null;
    data: object |  null;
    status: number;
}

class ApiClient {
    private axiosInstance: AxiosInstance;
    private tokenFilePath: string = './api2_token.json';

    constructor(baseURL: string = process.env.API2_HOST as string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private async saveToken(token: Token): Promise<void> {
        await fs.writeFile(this.tokenFilePath, JSON.stringify(token));
    }

    private async getStoredToken(): Promise<Token | null> {
        try {
            const data = await fs.readFile(this.tokenFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    private async getToken(apiKey: string): Promise<Token> {
        const response = await this.axiosInstance.post('/auth/access/by-api-key',
            { apiKey },
            { headers: { 'x-auth': 'auth' } }
        );
        const token: Token = response.data;
        await this.saveToken(token);
        return token;
    }

    private async getTokenFromRefresh(): Promise<Token> {
        const storedToken = await this.getStoredToken();
        if (!storedToken) {
            throw new Error('No refresh token found');
        }

        const formData = new FormData();
        formData.append('refreshToken', storedToken.refreshToken);

        const response = await this.axiosInstance.post('/auth/access/refresh',
            formData,
            { headers: { 'x-auth': 'auth' } }
        );
        const token: Token = response.data;
        await this.saveToken(token);
        return token;
    }

    async getOrdenesFabricacion(): Promise<ResultDataType> {
        let token = await this.getStoredToken();


        if (!token) {
            // Si no hay token almacenado, obtener uno nuevo
            token = await this.getToken( process.env.API2_APIKEY as string ); // Asegúrate de reemplazar esto con la apiKey real
        }
        const endpoint = '/solplay/ordenes-fabricacion/';
        try {
            const fecha_finFilter = "20220301";
            // const fecha_finFilter = getWeekAgoAnsiDate();
            const params = {
                filters: JSON.stringify(
                    { 
                        "$and": [ 
                            { 
                                cantidad: { ">": "0" }
                            }, 
                            { 
                                estado: { "=": 'C' } 
                            }, 
                            {
                                fecha_fin: { ">=": `${fecha_finFilter}` } 
                            }
                        ] 
                    }
                ),
                page: 1,
                itemsPerPage: 200,
                sortBy: JSON.stringify(["fecha_fin"]),
                sortDesc: JSON.stringify([false])
            };
            const headers = {
                'Authorization': `Bearer ${token.token}`
            };
            // console.log(">>> getOrdenesFabricacion >> ", params, headers );
            const response = await this.axiosInstance.get(endpoint, {
                params: params,
                headers: headers
            });
            return  { data: response.data as CargaToldoResultDataType, error: null, status: -1 };
        } catch (error) {
            return { data: null, error: JSON.stringify(error), status: -1 } ;
        }
    }

    
    async getOrdenFabricacion(ordenFabricacion: string): Promise<ResultDataType> {
        let token = await this.getStoredToken();


        if (!token) {
            // Si no hay token almacenado, obtener uno nuevo
            token = await this.getToken( process.env.API2_APIKEY as string ); // Asegúrate de reemplazar esto con la apiKey real
        }
        const endpoint = '/solplay/ordenes-fabricacion';
        try {
            const response = await this.axiosInstance.get(endpoint, {
                params: {
                    filters: JSON.stringify({ of: { "=": ordenFabricacion } }),
                    page: 1,
                    itemsPerPage: 10,
                    sortBy: JSON.stringify(["id"]),
                    sortDesc: JSON.stringify([false])
                },
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
            
            return  { data: response.data as CargaToldoResultDataType, error: null, status: -1 };
        } catch (error) {
            if(axios.isAxiosError(error)){
                const errors = error as AxiosError;
                // console.log("ERROR: ", error);
                if (errors.response && errors.response.status === 401) {
                    
                    // Si recibimos un 401, intentamos refrescar el token
                    token = await this.getTokenFromRefresh();

                    // Intentamos la llamada de nuevo con el nuevo token
                    const response = await this.axiosInstance.get(endpoint, {
                        params: {
                            filters: JSON.stringify({ of: { "=": ordenFabricacion } }),
                            page: 1,
                            itemsPerPage: 10,
                            sortBy: JSON.stringify(["id"]),
                            sortDesc: JSON.stringify([false])
                        },
                        headers: {
                            'Authorization': `Bearer ${token.token}`
                        }
                    });
                    return  { data: response.data as CargaToldoResultDataType, error: null, status: -1 };
                }
                return { data: null, error: error.message, status: -1 } ;
            } else {
                throw error;
            }
        }
    }
}

export default ApiClient;