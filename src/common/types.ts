export type Position = {
    x: number;
    y: number;
}

export type chunk = number[][];
export type world = chunk[][]

export type GameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
