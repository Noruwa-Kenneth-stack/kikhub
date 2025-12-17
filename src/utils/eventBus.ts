// utils/eventBus.ts
//eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (payload?: any) => void;

class EventBus {
  private events: Record<string, Callback[]> = {};

  on(event: string, callback: Callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  off(event: string, callback: Callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, payload?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(payload));
  }
}

export const eventBus = new EventBus();   
