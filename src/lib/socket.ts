import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fiveebusiness.com';

type Status = 'disconnected' | 'connecting' | 'connected' | 'error';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private status: Status = 'disconnected';
  private statusListeners: Array<(s: Status) => void> = [];

  init(token?: string) {
    if (token) this.token = token;
    if (this.socket) return this.socket;

    const auth = this.token ? { token: `Bearer ${this.token}` } : undefined;
    this.socket = io(URL, {
      transports: ['websocket'],
      auth,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    this.socket.on('connect', () => this.setStatus('connected'));
    this.socket.on('disconnect', () => this.setStatus('disconnected'));
    this.socket.on('connect_error', (err) => {
      console.error('Socket connect_error', err);
      this.setStatus('error');
    });

    return this.socket;
  }

  connect() {
    if (!this.socket) this.init();
    if (!this.socket) return;
    this.setStatus('connecting');
    try {
      this.socket.connect();
    } catch (e) {
      console.error('Socket connect failed', e);
      this.setStatus('error');
    }
  }

  disconnect() {
    if (this.socket) {
      try { this.socket.disconnect(); } catch (e) { /* ignore */ }
      this.socket = null;
      this.setStatus('disconnected');
    }
  }

  on(event: string, handler: (...args: any[]) => void) {
    this.socket?.on(event, handler);
  }

  off(event?: string, handler?: (...args: any[]) => void) {
    if (!this.socket) return;
    if (event && handler) this.socket.off(event, handler);
    else if (event) this.socket.off(event as any);
    else this.socket.off();
  }

  emit(event: string, payload?: any) {
    this.socket?.emit(event, payload);
  }

  getSocket() { return this.socket; }

  getStatus() { return this.status; }

  addStatusListener(fn: (s: Status) => void) { this.statusListeners.push(fn); }
  removeStatusListener(fn: (s: Status) => void) { this.statusListeners = this.statusListeners.filter(f => f !== fn); }

  private setStatus(s: Status) {
    this.status = s;
    this.statusListeners.forEach(fn => {
      try { fn(s); } catch (e) { /* ignore listener errors */ }
    });
  }
}

export const socketService = new SocketService();

export type { Status };