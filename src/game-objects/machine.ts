import { Interactibles, type InteractiblesConfig } from "./interactibles";
import type { StackData, Direction } from "../common/types";
import { registry } from "../systems/machine-registry";

export abstract class Machine extends Interactibles {

    #Interfacable: boolean;
    #stacks: StackData[] = [];
    #cleanedUp = false;

    constructor(config: InteractiblesConfig, health: number, assetKey: string, interfacable: boolean) {
        super(config, health, assetKey);
        this.#Interfacable = interfacable;
    }

    get interfacable(): boolean {
        return this.#Interfacable;
    }

    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }

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

    abstract acceptItem(stack: StackData): boolean;

    abstract canReceiveFrom(dir: Direction): boolean;

    abstract update(delta: number): void;

    protected insertIntoSlot(slotIndex: number, stack: StackData): StackData {
        const slot = this.#stacks[slotIndex];

        if (!slot) return stack;

        if (!slot.itemKey) {
            slot.itemKey = stack.itemKey;
            slot.amount  = Math.min(stack.amount, 64);
            const leftover = stack.amount - slot.amount;
            return { itemKey: leftover > 0 ? stack.itemKey : null, amount: leftover };
        }

        if (slot.itemKey === stack.itemKey && slot.amount < 64) {
            const space    = 64 - slot.amount;
            const accepted = Math.min(space, stack.amount);
            slot.amount   += accepted;
            const leftover = stack.amount - accepted;
            return { itemKey: leftover > 0 ? stack.itemKey : null, amount: leftover };
        }

        return stack; // slot occupied with different item
    }

    cleanupIfDead(): void {
    if (this.#cleanedUp || !this.isDead) return;
    this.#cleanedUp = true;
    Interactibles.clearSelected();
    Interactibles.clearHovered();
    Interactibles.onEntityDied?.(this.resourceKey, this.dropAmount);

    for (const stack of this.stacks) {
        if (stack.itemKey && stack.amount > 0) {
            Interactibles.onEntityDied?.(stack.itemKey, stack.amount);
            stack.itemKey = null;
            stack.amount = 0;
        }
    }

    this.removeInteractive();
    this.destroy();
    }

    protected checkDeath(): void {
        this.cleanupIfDead();
    }

    destroy(): void {
        registry.unregister(this);
        super.destroy();
    }

    consumeItem(slot: StackData): void {
        slot.amount -= 1;
        if (slot.amount <= 0) {
            slot.itemKey = null;
            slot.amount = 0;
        }
    }
}