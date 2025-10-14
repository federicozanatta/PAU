import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Conectado a WebSocket:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado de WebSocket');
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión WebSocket:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProduct(productId) {
    if (this.socket) {
      this.socket.emit('joinProduct', productId);
    }
  }

  leaveProduct(productId) {
    if (this.socket) {
      this.socket.emit('leaveProduct', productId);
    }
  }

  sendComment(productId, texto) {
    if (this.socket) {
      this.socket.emit('newComment', { productId, texto });
    }
  }

  onCommentAdded(callback) {
    if (this.socket) {
      this.socket.on('commentAdded', callback);
    }
  }

  onCommentError(callback) {
    if (this.socket) {
      this.socket.on('commentError', callback);
    }
  }

  offCommentAdded() {
    if (this.socket) {
      this.socket.off('commentAdded');
    }
  }

  offCommentError() {
    if (this.socket) {
      this.socket.off('commentError');
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
