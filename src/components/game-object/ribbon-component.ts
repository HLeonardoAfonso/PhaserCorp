import Phaser from 'phaser';

export class Ribbon {

    readonly x: number;
    readonly y: number;
    #pointsText: Phaser.GameObjects.Text | null = null;
    #points = -1000000;

    #formatPoints(value: number): string {
        const negative = value < 0;
        const absStr = Math.abs(value).toString();
        const parts: string[] = [];
        for (let i = absStr.length; i > 0; i -= 3) {
            parts.unshift(absStr.slice(Math.max(0, i - 3), i));
        }
        return (negative ? '-' : '') + parts.join('.');
    }

    constructor(scene: Phaser.Scene) {

        // Horizontally centered, 8% from the bottom
        this.x = scene.cameras.main.centerX;
        this.y = scene.cameras.main.height * 0.92;

        scene.add.image(this.x, this.y, 'RIBBON')
            .setScrollFactor(0)
            .setDepth(1004);

        this.#pointsText = scene.add.text(this.x +50, this.y-8, this.#formatPoints(this.#points), {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1005);
    }

    get points(): number { return this.#points; }

    set points(value: number) {
        this.#points = value;
        this.#pointsText?.setText(this.#formatPoints(value));
    }
}