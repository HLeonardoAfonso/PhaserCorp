import { RotatableMachine } from "./rotatable-machine";
import type { RotatableConfig } from "./rotatable-machine";
import type { Recipe, Direction, StackData } from "../../common/types";

export class Conveyer extends RotatableMachine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'WOOD_ITEM', amount: 2, },
        { itemKey: 'COPPER_WIRE', amount: 2, }, 
        { itemKey: 'IRON_GEAR', amount: 2 }, 
    ];
    static readonly craftItemKey = 'MACHINE_CONVEYOR';
    static readonly craftDisplayKey = 'CONVEYOR';

    get resourceKey(): string { return 'MACHINE_CONVEYOR'; }

    constructor(config: RotatableConfig) {
        super(config, 100, 'CONVEYOR', false);
        this.setStackCount(3);
        this.setAngle(this.facing === 'up' ? -90 :
                      this.facing === 'down' ? 90 :
                      this.facing === 'left' ? 180 : 0);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 0)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }

    acceptItem(_stack: StackData): boolean {
        // Will be fully implemented in Step 5
        return false;
    }

    canReceiveFrom(_dir: Direction): boolean {
        // Will be fully implemented in Step 5
        return false;
    }

    update(_delta: number): void {
        // Will be fully implemented in Step 5
        this.checkDeath();
    }

    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }
}