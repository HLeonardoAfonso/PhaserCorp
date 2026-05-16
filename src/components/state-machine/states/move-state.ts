import Phaser from "phaser";
import { State } from "../state";
import { IdleState } from "./idle-state";
import { isArcadePhysicsBody } from "../../../common/utils";
import type { StateMachine } from "../state-machine";
import type { ControlsComponent } from "../../game-object/controls-component";


export class MoveState extends State {
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
        this.gameObject.play({ key: "MOVE", repeat: -1 }, true);
    }

    onUpdate(): void {
        const controls = this.#controlsComponent.controls;
        let vx = 0;
        let vy = 0;

        if (controls.isLeftDown) {
            vx = -1;
            this.gameObject.setFlipX(true);
        } else if (controls.isRightDown) {
            vx = 1;
            this.gameObject.setFlipX(false);
        }

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

        const isMoving = controls.isLeftDown || controls.isRightDown || controls.isUpDown || controls.isDownDown;
        if (!isMoving) {
            this.stateMachine.setState(
                new IdleState(
                    this.gameObject as Phaser.Physics.Arcade.Sprite,
                    this.stateMachine,
                    this.#controlsComponent,
                ),
            );
        }
    }

    updateVelocity(isX: boolean, value: number): void {
        if (!isArcadePhysicsBody(this.gameObject.body)) {
            return;
        }
        if (isX) {
            this.gameObject.body.velocity.x = value;
            return;
        }
        this.gameObject.body.velocity.y = value;
    }
}