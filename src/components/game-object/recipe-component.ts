import Phaser from 'phaser';

export class RecipeOverlay {
    #sprites: Phaser.GameObjects.Sprite[][] = [];
    #goldItem: Phaser.GameObjects.Image;
    #debugRect: Phaser.GameObjects.Rectangle | null = null;
    #isHovering = false;

    constructor(scene: Phaser.Scene, debug = false) {
        const FRAMES = [[0, 2], [6, 8]];
        this.#sprites = FRAMES.map(row =>
            row.map(frame =>
                scene.add.sprite(0, 0, 'PAPER', frame)
                .setScrollFactor(0)
                .setDepth(1100)
                .setVisible(false)
            )
        );

        this.#goldItem = scene.add.image(0, 0, 'GOLD_ITEM')
            .setScrollFactor(0)
            .setDepth(1101)
            .setVisible(false);

        if (debug) {
            this.#debugRect = scene.add.rectangle(0, 0, 64, 64)
                .setStrokeStyle(1, 0x00ff00, 0.8)
                .setScrollFactor(0)
                .setDepth(1102)
                .setVisible(false);
        }

        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.#isHovering) this.#follow(pointer);
        });
    }

    #follow(pointer: Phaser.Input.Pointer): void {
        this.#sprites.forEach((row, ri) => {
            row.forEach((sprite, ci) => {
                sprite.setPosition(
                    pointer.x + 20 + ci * 48, 
                    pointer.y - 80 + ri * 64
                );
            });
        });

        const goldX = pointer.x + 20 + 24;
        const goldY = pointer.y - 80 + 32;
        this.#goldItem.setPosition(goldX, goldY);
        this.#debugRect?.setPosition(goldX, goldY);
    }

    show(pointer: Phaser.Input.Pointer): void {
        this.#isHovering = true;
        this.#follow(pointer);
        this.#sprites.forEach(row => row.forEach(s => s.setVisible(true)));
        this.#goldItem.setVisible(true);
        this.#debugRect?.setVisible(true);
    }

    hide(): void {
        this.#isHovering = false;
        this.#sprites.forEach(row => row.forEach(s => s.setVisible(false)));
        this.#goldItem.setVisible(false);
        this.#debugRect?.setVisible(false);
    }
}