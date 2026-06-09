import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe, Direction, StackData } from "../../common/types";

export class Furnace extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'GOLD_ITEM', amount: 2, },
        { itemKey: 'IRON_ITEM', amount: 2, }, 
        { itemKey: 'COPPER_ITEM', amount: 2 },
        { itemKey: 'COAL_ITEM', amount: 2 },
    ];    
    static readonly craftItemKey = 'MACHINE_FURNACE';
    static readonly craftDisplayKey = 'FURNACE';

    get resourceKey(): string { return 'MACHINE_FURNACE'; }

    // processing bool = false

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'FURNACE', true);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 64)
        this.setDepth(config.position.y);

        // Each furnace instance owns its own slot stacks:
        // [0] = input slot 1, [1] = input slot 2, [2] = output slot
        this.setStackCount(3);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
    
    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }

    acceptItem(_stack: StackData): boolean {
        // Will be fully implemented in Step 6 with routing by item tag
        return false;
    }

    canReceiveFrom(_dir: Direction): boolean {
        // Will be fully implemented in Step 6 — accepts from all directions
        return true;
    }

    update(_delta: number): void {
        // Will be fully implemented in Step 6 — smelting logic
        this.checkDeath();
    }
}
