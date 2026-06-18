import type { StackData } from '../common/types';

const STORAGE_KEY = 'phasercorp_save';

export interface SaveData {
    shopPoints: number;
    player: { x: number; y: number };
    inventory: StackData[];
    timestamp: number;
}

export class SaveManager {

    static save(points: number, playerX: number, playerY: number, inventory: StackData[]): void {
        const data: SaveData = {
            shopPoints: points,
            player: { x: playerX, y: playerY },
            inventory,
            timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    static load(): SaveData | null {
        const loaded = localStorage.getItem(STORAGE_KEY);
        if (!loaded) return null;
        try {
            return JSON.parse(loaded) as SaveData;
        } catch {
            return null;
        }
    }

    static hasSavedGame(): boolean {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    static delete(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
}