import type { Recipe } from "../../common/types";
import type { InteractiblesConfig } from "../interactibles";
import { Machine } from "../machine";

export class ConveyerCurve extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { key: 'COPPER_PLATE', amount: 2, }, 
        { key: 'IRON_PLATE', amount: 2 }, 
    ];    
    static readonly craftItemKey = 'MACHINE_CONVEYOR_CURVE';
    static readonly craftDisplayKey = 'CONVEYOR_CURVE';

    get resourceKey(): string { return 'MACHINE_CONVEYOR_CURVE'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'CONVEYOR_CURVE', false);
        this.playIdleAnimation();
        this.setBodySize(64, 64-10);
        this.body?.setOffset(0, 64+5)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
}
