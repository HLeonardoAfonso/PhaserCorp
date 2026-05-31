import type { Recipe } from "../../common/types";
import { Interactibles, type InteractiblesConfig } from "../interactibles";

export class ConveyerCurve extends Interactibles {
    
    static readonly craftRecipe: Recipe = [{ key: 'WOOD_ITEM', amount: 1 }];
    static readonly craftItemKey = 'MACHINE_CONVEYOR_CURVE';
    static readonly craftDisplayKey = 'CONVEYOR_CURVE';

    get resourceKey(): string { return 'MACHINE_CONVEYOR_CURVE'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100);
        this.playIdleAnimation();
        this.setBodySize(64, 64-10);
        this.body?.setOffset(0, 64+5)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }

    playIdleAnimation(): void {}

    getRecipe(): Recipe {
        return ConveyerCurve.craftRecipe;
    }

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