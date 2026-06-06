import { Interactibles, type InteractiblesConfig } from "./interactibles";

export class Shop extends Interactibles {

    get resourceKey(): string { return 'SHOP'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'SHOP');
        this.playIdleAnimation();
        this.setBodySize(352, 180);
        this.body?.setOffset(16, 170);
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(16, 170, 352, 180);
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
}