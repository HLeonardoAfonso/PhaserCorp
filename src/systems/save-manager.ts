import type { StackData, EntitySaveState, MachineSaveState } from '../common/types';

const STORAGE_KEY = 'phasercorp_save';

export interface SaveData {
    shopPoints: number;
    player: { x: number; y: number };
    inventory: StackData[];
    entityStates: EntitySaveState[];
    machines: MachineSaveState[];
    timestamp: number;
}

export class SaveManager {

    private static entityStates: EntitySaveState[] = [];
    private static machines: MachineSaveState[] = [];

    static save(points: number, playerX: number, playerY: number, inventory: StackData[], entityStates: EntitySaveState[], machines: MachineSaveState[]): void {
        const data: SaveData = {
            shopPoints: points,
            player: { x: playerX, y: playerY },
            inventory,
            entityStates,
            machines,
            timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    static load(): SaveData | null {
        const loaded = localStorage.getItem(STORAGE_KEY);
        if (!loaded) return null;
        try {
            const data = JSON.parse(loaded) as SaveData;
            SaveManager.entityStates = data.entityStates ?? [];
            SaveManager.machines = data.machines ?? [];
            return data;
        } catch {
            return null;
        }
    }

    static hasSavedGame(): boolean {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    static delete(): void {
        localStorage.removeItem(STORAGE_KEY);
        SaveManager.entityStates = [];
    }

    static setEntityStates(states: EntitySaveState[]): void {
        SaveManager.entityStates = states;
    }

    static getSavedStates(): readonly EntitySaveState[] {
        return SaveManager.entityStates;
    }

    static setMachines(states: MachineSaveState[]): void {
        SaveManager.machines = states;
    }

    static getSavedMachines(): MachineSaveState[] {
        return SaveManager.machines;
    }
}
