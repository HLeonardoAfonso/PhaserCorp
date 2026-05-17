import type { Position } from "../common/types";
import { ControlsComponent } from "../components/game-object/controls-component";
import type { InputComponent } from "../components/input/input-components";
import { StateMachine } from "../components/state-machine/state-machine";
import { IdleState } from "../components/state-machine/states/idle-state";
import type { Interactibles } from "./interactibles";

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
    #interactZone: Phaser.GameObjects.Zone;
    #nearInteractible: Interactibles | null = null;

    constructor(config: PlayerConfig) {
        const { scene, position, assetKey, frame } = config;
        const { x, y } = position;
        super(scene, x, y, assetKey, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5,0.6)
        this.setBodySize(30, 30);
        this.setOffset(82, 100);

        this.#controlsComponent = new ControlsComponent(this, config.controls);
        this.#stateMachine = new StateMachine(this);

        this.#stateMachine.setState(
            new IdleState(this, this.#stateMachine, this.#controlsComponent),
        );

        this.#interactZone = scene.add.zone(x, y, 80, 80);
        scene.physics.add.existing(this.#interactZone);
    }

    getInteractZone(): Phaser.GameObjects.Zone {
    return this.#interactZone;
    }

    get nearInteractible() { return this.#nearInteractible; }
    set nearInteractible(val: Interactibles | null) { this.#nearInteractible = val; }

    update(): void {
        this.#stateMachine.update();
        this.setDepth(this.y);
        this.#interactZone.setPosition(this.x, this.y);
    }
}