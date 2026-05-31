import { Interactibles, type InteractiblesConfig } from "../interactibles";
import type { Recipe } from "../../common/types";

export class Conveyer extends Interactibles {
    
    static readonly craftRecipe: Recipe = [{ key: 'WOOD_ITEM', amount: 1 }];
    static readonly craftItemKey = 'MACHINE_CONVEYOR';
    static readonly craftDisplayKey = 'CONVEYOR';

    get resourceKey(): string { return 'MACHINE_CONVEYOR'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100);
        this.playIdleAnimation();
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 0)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }

    playIdleAnimation(): void {}

    getRecipe(): Recipe {
        return Conveyer.craftRecipe;
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