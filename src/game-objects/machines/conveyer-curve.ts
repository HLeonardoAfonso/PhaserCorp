import { Interactibles, type InteractiblesConfig } from "../interactibles";

export class ConveyerCurve extends Interactibles {
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

    playIdleAnimation(): void {
        this.play('MACHINE_CONVEYOR_CURVE');
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