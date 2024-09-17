import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';

class SocketHandler {
  private static instance: SocketHandler;
  private io: SocketIOServer | null = null;

  private constructor() {}

  static getInstance(): SocketHandler {
    if (!SocketHandler.instance) {
      SocketHandler.instance = new SocketHandler();
    }
    return SocketHandler.instance;
  }

  initialize(server: http.Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // Asegúrate de ajustar esto en producción
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('Un cliente se ha conectado');

      // Manejar mensajes recibidos
      socket.on('mensaje', (data: string | object) => {
        console.log('Mensaje recibido:', data);
        // Retransmitir el mensaje a todos los clientes
        this.broadcastMessage('mensaje', data);
      });

      socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
      });
    });
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }

  // Método para emitir un mensaje a todos los clientes
  broadcastMessage(event: string, data: string | object) {
    if (this.io) {
      this.io.emit(event, data);
    } else {
      console.error('Socket.IO no ha sido inicializado');
    }
  }

  // Método para emitir un mensaje desde el servidor
  emitMessage(event: string, data: string | object) {
    if (this.io) {
      this.io.emit(event, data);
      // console.log("EMITIENDO",event, data);
    } else {
      console.error('Socket.IO no ha sido inicializado');
    }
  }
}

export default SocketHandler.getInstance();