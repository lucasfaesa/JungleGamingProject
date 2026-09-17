import type { GameEventType } from "./GameEvents";

type Callback = (data?: unknown) => void;

class EventHub {
    private listeners: Partial<Record<GameEventType, Callback[]>> = {};

    on(event: GameEventType, callback: Callback): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(callback);
    }

    emit(event: GameEventType, data?: unknown): void {
        this.listeners[event]?.forEach((callback) => callback(data));
    }

    off(event: GameEventType, callback: Callback): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback);
    }
}

export const eventHub = new EventHub();
