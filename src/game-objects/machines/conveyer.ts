import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe } from "../../common/types";

export class Conveyer extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { key: 'WOOD_ITEM', amount: 2, },
        { key: 'COPPER_WIRE', amount: 2, }, 
        { key: 'IRON_GEAR', amount: 2 }, 
    ];
    static readonly craftItemKey = 'MACHINE_CONVEYOR';
    static readonly craftDisplayKey = 'CONVEYOR';

    get resourceKey(): string { return 'MACHINE_CONVEYOR'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'CONVEYOR');
        this.playIdleAnimation();
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 0)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
}
