import { Interactibles, type InteractiblesConfig } from "../interactibles";

export class Furnace extends Interactibles {
    
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
    static get placementRect(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }
}