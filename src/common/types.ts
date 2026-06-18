export type GameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;

export type Position = {
    x: number;
    y: number;
}

export type chunk = number[][];
export type world = chunk[][];

export type StackData = { itemKey: string | null; amount: number };
export type Recipe = StackData[];

export type Direction = 'up' | 'down' | 'left' | 'right';

export type EntitySaveState = {
    id: number;
    health: number;
};

export type MachineSaveState = {
    typeKey: string;
    x: number;
    y: number;
    facing: Direction;
    health: number;
    stacks: StackData[];
};
