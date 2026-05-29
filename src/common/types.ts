export type Position = {
    x: number;
    y: number;
}

export type chunk = number[][];
export type world = chunk[][];

export type Recipe = {key: string; amount: number }[];

export type GameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
