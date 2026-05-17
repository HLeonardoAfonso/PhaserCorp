import Phaser from "phaser";
import { State } from "../state";
import { MoveState } from "./move-state";
import { ActState } from "./act-state";
import type { StateMachine } from "../state-machine";
import type { ControlsComponent } from "../../game-object/controls-component";
import type { Player } from "../../../game-objects/player";
import { Tree } from "../../../game-objects/tree";
import { Interactibles } from "../../../game-objects/interactibles";

export class IdleState extends State {
    declare protected gameObject: Phaser.Physics.Arcade.Sprite;
    #controlsComponent: ControlsComponent;

    constructor(
        gameObject: Phaser.Physics.Arcade.Sprite,
        stateMachine: StateMachine,
        controlsComponent: ControlsComponent,
    ) {
        super(gameObject, stateMachine);
        this.#controlsComponent = controlsComponent;
    }

    onEnter(_previousState: State | null): void {
        this.gameObject.setVelocity(0, 0);
        this.gameObject.play({ key: "IDLE", repeat: -1 }, true);
    }

    onUpdate(): void {
        const controls = this.#controlsComponent.controls;
        
        const selected = Interactibles.currentSelected;

        if ((selected instanceof Tree) && (this.gameObject as Player).nearInteractibles.has(selected)){
            this.stateMachine.setState(
                new ActState(
                    this.gameObject as Phaser.Physics.Arcade.Sprite,
                    this.stateMachine,
                    this.#controlsComponent,
                    "ACT_AXE",
                ),
            );
            return
        }

        const isMoving = controls.isLeftDown || controls.isRightDown || controls.isUpDown || controls.isDownDown;

        if (isMoving) {
            this.stateMachine.setState(
                new MoveState(
                    this.gameObject as Phaser.Physics.Arcade.Sprite,
                    this.stateMachine,
                    this.#controlsComponent,
                ),
            );
        }
    }
}
