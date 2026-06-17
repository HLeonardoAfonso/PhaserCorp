import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe, Direction, StackData } from "../../common/types";
import { OPPOSITE, DIRECTIONS } from "../../common/const";
import { registry } from "../../systems/machine-registry";

export class Crate extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'WOOD_ITEM', amount: 3, }
    ];    
    static readonly craftKey = 'CRATE';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly CRATE_PUSH_INTERVAL = 1000;

    get resourceKey(): string { return 'CRATE'; }

    #crateProgress = 0;
    #nextSlotIndex = 0;

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'CRATE', true);
        registry.register(this);
        this.setOrigin(Crate.displayOrigin.x, Crate.displayOrigin.y);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 32)
        this.setDepth(config.position.y);

        this.setStackCount(9);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
    
    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }

    acceptItem(stack: StackData): boolean {
        const leftover = this.routingStack(stack);
        // Accept only if all items were placed (no leftover)
        return leftover.itemKey === null;
    }

    canReceiveFrom(_dir: Direction): boolean {
        // all directions
        return true;
    }

    update(delta: number): void {
        this.checkDeath();
        if (this.isDead) return;

        this.#crateProgress += delta;

        if (this.#crateProgress >= Crate.CRATE_PUSH_INTERVAL) {
            this.#crateProgress = 0;
            this.#pushOutputToNeighbor();
        }
    }

    #pushOutputToNeighbor(): void {
        for (let i = 0; i < this.stacks.length; i++) {
            const slotIndex = (this.#nextSlotIndex + i) % this.stacks.length;
            const slot = this.stacks[slotIndex];
            
            if (slot.itemKey === null || slot.amount <= 0) continue;

            for (const dir of DIRECTIONS) {
                const neighbor = registry.getNeighbor(this, dir);
                
                if (!neighbor) continue;
                if (!neighbor.canReceiveFrom(OPPOSITE[dir])) continue;

                const stack: StackData = {
                    itemKey: slot.itemKey,
                    amount: 1,
                };
                if (neighbor.acceptItem(stack)) {
                    this.consumeItem(slot);
                    break; // Item from this slot was pushed, move to next slot
                }
            }
        }

        // Advance next slot index so we start from a different slot next tick
        this.#nextSlotIndex = (this.#nextSlotIndex + 1) % this.stacks.length;
    }

    private routingStack(stack: StackData): StackData {
        if (!stack.itemKey) return stack;

        let leftover: StackData = { itemKey: stack.itemKey, amount: stack.amount };

        // Try inserting into any slot that is empty or matches the item type
        for (let i = 0; i < this.stacks.length; i++) {
            if (leftover.itemKey === null || leftover.amount <= 0) break;
            leftover = this.insertIntoSlot(i, leftover);
        }

        return leftover;
    }
}