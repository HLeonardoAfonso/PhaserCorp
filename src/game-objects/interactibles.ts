import type { Position } from "../common/types";

export type InteractiblesConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?: number;
}

export abstract class Interactibles extends Phaser.Physics.Arcade.Sprite {
    constructor(config: InteractiblesConfig) {
        const { scene, position, assetKey, frame } = config;
        super(scene, position.x, position.y, assetKey, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, true); //Para ter collider
    }

    abstract playIdleAnimation(): void;
    abstract playInteractAnimation(): void;
}