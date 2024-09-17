import * as net from 'net';
import * as dotenv from 'dotenv';
// import * as colors from 'cli-color';

dotenv.config(); // Load environment variables from .env

const HOST = process.env.SINGULAR_LOGISTICS_HOST || "192.168.86.139";
const PORT = process.env.SINGULAR_LOGISTICS_PORT || 30000;

interface NetworkError extends Error {
    code?: string;
}

class TcpClient {
    private host: string;
    private port: number;
    private _isConnected: boolean = false;
    private fnHandleData: (data: Buffer) => void;
    private client: net.Socket | null;
    private readonly reconnectInterval: number = 5000;
    private readonly heartbeatInterval: number = 30000;

    constructor(callbackHandleData: (data: Buffer) => void = () => null) {
        this.host = HOST;
        this.port = Number(PORT);
        this.fnHandleData = callbackHandleData;
        this.client = null;
    }

    isConnected(): boolean {
        return this._isConnected;
    }

    connect(): void {
        this.client = net.connect(this.port, this.host, () => {
            console.log(`\nConexión establecida con el servidor ${this.host}:${this.port}`);
            this.fnHandleData(Buffer.from("CONNECTED", 'utf-8'));
            this._isConnected = true;
            // this.setupHeartbeat();
        });

        this.client.on('data', (data: Buffer) => {
            // Handle incoming messages from the server
            try {
                // console.log('Mensaje recibido:', data.toString());
                if (this.fnHandleData !== undefined && this.fnHandleData !== null) {
                    this.fnHandleData(data);
                }
            } catch (error) {
                console.error("ERROR", error);
            }
        });

        this.client.on('end', () => {
            this.fnHandleData(Buffer.from("DISCONNECTED (evento end)", 'utf-8'));
            if (this._isConnected) {
                console.log('Conexión cerrada por el servidor.');
                this._isConnected = false;
            }
        });

        this.client.on('error', (err: NetworkError) => {
            if (err.code === 'ECONNRESET') {
                // this._isConnected = false;
                console.error('Connection reset by peer');
            } else {
                // this._isConnected = false;
                console.error('Error occurred:', err);
            }
        });

        this.client.on('close', (hadError: boolean) => {
            this.fnHandleData(Buffer.from("DISCONNECTED (evento close)", 'utf-8'));
            if (this._isConnected) {
                console.log(hadError ? 'Conexión cerrada debido a un error.' : 'Conexión cerrada.');
                this._isConnected = false; // Update isConnected on disconnection
            }
            // this.scheduleReconnection();
        });
    }
    
    sendMessage(message: string): number {
        let _try = 1;
        while (_try > 0) {
            _try--;
            try {
                this.client?.write(message);
                console.log(`>>>${message}`);
                // console.log(colors.green(`>>>${message}`));
                return 1;
            } catch (error) {
                // console.log(error);
                console.log(`Mensaje no enviado por error, reintantando ${_try + 1}`);
            }
        }
        return 0;
    }

    close(): void {
        this.client?.end();
    }

    destroy():void {
        this.client?.destroy();        
    }


    private setupHeartbeat(): void {
        // if (!this.client) return;

        // let timeoutId: NodeJS.Timeout;

        // const heartbeat = () => {
        //     clearTimeout(timeoutId);
        //     timeoutId = setTimeout(() => {
        //         console.log('Connection lost due to inactivity');
        //         this.client?.destroy();
        //     }, this.heartbeatInterval);
        // };

        // this.client.on('data', heartbeat);
        // this.client.on('ping', heartbeat);
        // heartbeat();
    }

    private scheduleReconnection(): void {
        // console.log(`Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`);
        // setTimeout(() => this.connect(), this.reconnectInterval);
    }

    disconnect(): void {
        if (this.client) {
            this.client.destroy();
            this.client = null;
        }
    }
}

export default TcpClient;