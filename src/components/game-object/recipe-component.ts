import Phaser from 'phaser';
import type { Recipe } from '../../common/types';
import { DEPTH } from '../../common/depth';

export class RecipeOverlay {
    #scene: Phaser.Scene;
    #sprites: Phaser.GameObjects.Sprite[][] = [];
    #recipeImages: Phaser.GameObjects.Image[] = [];
    #amountTexts: Phaser.GameObjects.Text[] = [];
    #isHovering = false;

    constructor(scene: Phaser.Scene) {
        this.#scene = scene;

        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.#isHovering) this.#follow(pointer);
        });
    }

    #buildFrameSprites(recipeLength: number): void {

        const columns = recipeLength + 1;

        for (let row = 0; row < 2; row++) {
            this.#sprites[row] = [];
            for (let col = 0; col < columns; col++) {
                let frame: number;
                if (col === 0) {
                    frame = row === 0 ? 0 : 6;
                } else if (col === columns - 1) {
                    frame = row === 0 ? 2 : 8;
                } else {
                    frame = row === 0 ? 1 : 7;
                }

                const sprite = this.#scene.add.sprite(0, 0, 'PAPER', frame)
                    .setScrollFactor(0)
                    .setDepth(DEPTH.RECIPE_FRAME)
                    .setVisible(this.#isHovering);

                this.#sprites[row].push(sprite);
            }
        }
    }

    #destroyFrameSprites(): void {
        this.#sprites.forEach(row => row.forEach(sprite => sprite.destroy()));
        this.#sprites = [];
    }

    #buildRecipeImages(recipe: Recipe): void {
        recipe.forEach(item => {
            if (!item.itemKey) return;
            const img = this.#scene.add.image(0, 0, item.itemKey)
                .setScrollFactor(0)
                .setDepth(DEPTH.RECIPE_IMAGE)
                .setVisible(this.#isHovering);
            this.#recipeImages.push(img);

            const text = this.#scene.add.text(0, 0, `${item.amount}`, {
                fontSize: '16px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
            })
                .setOrigin(1, 1)
                .setScrollFactor(0)
                .setDepth(DEPTH.RECIPE_IMAGE)
                .setVisible(this.#isHovering);
            this.#amountTexts.push(text);
        });
    }

    #follow(pointer: Phaser.Input.Pointer): void {
        const columns = this.#sprites[0]?.length ?? 0;

        this.#sprites.forEach((row, ri) => {
            row.forEach((sprite, ci) => {
                sprite.setPosition(
                    pointer.x + 20 + ci * 48,
                    pointer.y - 80 + ri * 64
                );
            });
        });

        if (columns > 0) {
            const baseY = pointer.y - 80 + 32;
            this.#recipeImages.forEach((img, i) => {
                const x = pointer.x + 20 + (i + 0.5) * 48;
                img.setPosition(x, baseY);
            });
            this.#amountTexts.forEach((text, i) => {
                const x = pointer.x + 20 + (i + 0.5) * 48 + 22;
                const y = pointer.y - 80 + 32 + 20;
                text.setPosition(x, y);
            });
        }
    }

    show(pointer: Phaser.Input.Pointer, recipe?: Recipe): void {
        this.#isHovering = true;

        if (recipe) {
            this.#buildFrameSprites(recipe.length);
            this.#buildRecipeImages(recipe);
        }

        this.#follow(pointer);
        this.#sprites.forEach(row => row.forEach(s => s.setVisible(true)));
        this.#recipeImages.forEach(img => img.setVisible(true));
        this.#amountTexts.forEach(text => text.setVisible(true));
    }

    hide(): void {
        this.#isHovering = false;
        this.#destroyFrameSprites();
        this.#recipeImages.forEach(img => img.destroy());
        this.#recipeImages = [];
        this.#amountTexts.forEach(text => text.destroy());
        this.#amountTexts = [];
    }
}