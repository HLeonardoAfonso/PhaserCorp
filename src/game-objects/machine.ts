import { Interactibles, type InteractiblesConfig } from "./interactibles";
import type { StackData } from "../common/types";

export abstract class Machine extends Interactibles {

    #Interfaceble: boolean;
    #stacks: StackData[] = [];
    
    constructor(config: InteractiblesConfig, health: number, assetKey: string, interfaceble: boolean) {
        super(config, health, assetKey);
        this.#Interfaceble = interfaceble;
    }

    get interfaceble(): boolean {
        return this.#Interfaceble;
    }

    /** Per-instance slot data. Mutated by the interface / process logic. */
    get stacks(): StackData[] {
        return this.#stacks;
    }

    /** Initialize the stack slots for this machine. Called by subclasses in their constructor. */
    protected setStackCount(count: number): void {
        this.#stacks = Array.from({ length: count }, () => ({ itemKey: null, amount: 0 }));
    }

    getStack(index: number): StackData | null {
        return this.#stacks[index] ?? null;
    }

    setStack(index: number, data: StackData): void {
        if (index < 0 || index >= this.#stacks.length) return;
        this.#stacks[index] = data;
    }

    playIdleAnimation(): void {}

    update(): void {
        if (this.isDead) {
            Interactibles.clearSelected();
            Interactibles.clearHovered();
            Interactibles.onEntityDied?.(this.resourceKey);
            this.removeInteractive();
            this.destroy();
        }
    }
}
