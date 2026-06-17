import { Interactibles, type InteractiblesConfig } from "./interactibles";

export class Tree extends Interactibles {

    get resourceKey(): string { return 'WOOD_ITEM'; }
    get dropAmount(): number { return 16; }

    #opaqueZone: Phaser.GameObjects.Zone;
    constructor(config: InteractiblesConfig) {
        super(config, 100, 'TREE');
        this.playIdleAnimation();
        this.setOrigin(0.51, 0.83);
        this.setBodySize(30, 30);
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(66, 0, 64, 175);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
        this.#opaqueZone = this.scene.add.zone(this.x, this.y-72, 64, 175);
        this.scene.physics.add.existing(this.#opaqueZone);
    }

    get opaqueZone() { return this.#opaqueZone; }

    playIdleAnimation(): void {
        this.play('TREE_IDLE');
    }

    playInteractAnimation(): void {
        this.play('TREE_CHOP');
        this.once('animationcomplete-TREE_CHOP', () => {
            this.update();
            if(!this.isDead){
                this.playIdleAnimation();
            }
        })
    }

    update(): void {
        if (this.isDead) {
            this.stop();
            this.setFrame(8);
            Interactibles.clearHovered();
            Interactibles.onEntityDied?.(this.resourceKey, this.dropAmount);
            this.removeInteractive();
            this.#opaqueZone.destroy();
            this.setAlpha(1);
            // Se a arvore poder se regenerar, é melhor disable do que o remove
            //this.disableInteractive();
        }
    }
}