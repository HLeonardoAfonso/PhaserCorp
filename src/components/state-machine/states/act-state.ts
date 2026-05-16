import Phaser from "phaser";
import { State } from "../state";
import type { StateMachine } from "../state-machine";
import { IdleState } from "./idle-state";
import type { ControlsComponent } from "../../game-object/controls-component";

export class ActState extends State {
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
        this.gameObject.play({ key: "ACT", repeat: 0 }, true);

        this.gameObject.once("animationcomplete-ACT", () => {
            this.stateMachine.setState(
                new IdleState(
                    this.gameObject as Phaser.Physics.Arcade.Sprite,
                    this.stateMachine,
                    this.#controlsComponent,
                ),
            );
        });
    }

    onUpdate(): void {
        // Do nothing — waiting for animation to complete
    }
}