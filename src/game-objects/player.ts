import type { Position } from "../common/types";
import { ControlsComponent } from "../components/game-object/controls-component";
import type { InputComponent } from "../components/input/input-components";
import { StateMachine } from "../components/state-machine/state-machine";
import { IdleState } from "../components/state-machine/states/idle-state";

export type PlayerConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?: number;
    controls: InputComponent;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    #controlsComponent: ControlsComponent;
    #stateMachine: StateMachine;

    constructor(config: PlayerConfig) {
        const { scene, position, assetKey, frame } = config;
        const { x, y } = position;
        super(scene, x, y, assetKey, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.#controlsComponent = new ControlsComponent(this, config.controls);
        this.#stateMachine = new StateMachine(this);

        this.#stateMachine.setState(
            new IdleState(this, this.#stateMachine, this.#controlsComponent),
        );
    }

    update(): void {
        this.#stateMachine.update();
    }
}