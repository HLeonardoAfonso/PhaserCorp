import { Interactibles, type InteractiblesConfig } from "./interactibles";

export class Tree extends Interactibles {
    constructor(config: InteractiblesConfig) {
        super(config, 100);
        this.playIdleAnimation();
        this.setOrigin(0.51, 0.83);
        this.setBodySize(30, 30);
        this.setDepth(config.position.y);
    }

    playIdleAnimation(): void {
        this.play('TREE_IDLE');
    }

    playInteractAnimation(): void {
        this.play('TREE_CHOP');
        this.once('animationcomplete-TREE_CHOP', () => {
            this.playIdleAnimation();
        })
    }

    update(): void {
        if (this.isDead) {
            this.stop();
            this.setFrame(8);
            Interactibles.clearHovered();
            this.disableInteractive();
        }
    }
}