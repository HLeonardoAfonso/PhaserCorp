import type { Position } from "../common/types";
import { isArcadePhysicsBody } from "../common/utils";
import { ControlsComponent } from "../components/game-object/controls-component";
import type { InputComponent } from "../components/input/input-components";

export type PlayerConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?: number;
    controls: InputComponent;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    #controlsComponent: ControlsComponent;

    constructor(config: PlayerConfig) {
        const { scene, position, assetKey, frame } = config;
        const { x, y } = position;
        super(scene, x, y, assetKey, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.#controlsComponent = new ControlsComponent(this, config.controls);

        this.play({key: 'IDLE', repeat: -1});
    }

    update(): void {
        const controls = this.#controlsComponent.controls;
        let vx = 0;
        let vy = 0;

        if (controls.isLeftDown) vx = -1;
        else if (controls.isRightDown) vx = 1;

        if (controls.isUpDown) vy = -1;
        else if (controls.isDownDown) vy = 1;

        // Normalize diagonal movement so it's not faster
        if (vx !== 0 && vy !== 0) {
            const factor = 1 / Math.SQRT2;
            vx *= factor;
            vy *= factor;
        }

        const SPEED = 200;
        this.updateVelocity(true, vx * SPEED);
        this.updateVelocity(false, vy * SPEED);
    }

    updateVelocity(isX: boolean, value: number): void{
        if (!isArcadePhysicsBody(this.body)) {
            return;
        }
        if (isX) {
            this.body.velocity.x = value;
            return;
        }
        this.body.velocity.y = value;
    }
}
