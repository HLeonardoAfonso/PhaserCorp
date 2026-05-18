import { Interactibles, type InteractiblesConfig } from "./interactibles";

export class Ore extends Interactibles {
    constructor(config: InteractiblesConfig) {
        super(config, 100);
        this.playIdleAnimation();
        this.setBodySize(45, 45);
        this.setDepth(config.position.y);

        this.removeInteractive();
        this.setInteractive(new Phaser.Geom.Rectangle(40, 40, 45, 45), Phaser.Geom.Rectangle.Contains);
    }

    playIdleAnimation(): void {
        this.play('ORE_IDLE');
    }

    update(): void {
        if (this.isDead) {
            Interactibles.clearSelected();
            Interactibles.clearHovered();
            this.removeInteractive();
            this.destroy();
        }
    }
}