import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe } from "../../common/types";

export class Furnace extends Machine {
    
    static readonly craftRecipe: Recipe = [{ key: 'WOOD_ITEM', amount: 1 }];
    static readonly craftItemKey = 'MACHINE_FURNACE';
    static readonly craftDisplayKey = 'FURNACE';

    get resourceKey(): string { return 'MACHINE_FURNACE'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100);
        this.playIdleAnimation();
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 64)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
    
    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }
}