import Phaser from "phaser";
import { State } from "../state";
import type { StateMachine } from "../state-machine";
import { IdleState } from "./idle-state";
import type { ControlsComponent } from "../../game-object/controls-component";
import { Tree } from "../../../game-objects/tree";
import { Interactibles } from "../../../game-objects/interactibles";
import { MoveState } from "./move-state";
import { Ore } from "../../../game-objects/ore";
import { Machine } from "../../../game-objects/machine";

export class ActState extends State {
    declare protected gameObject: Phaser.Physics.Arcade.Sprite;
    #animKey: string;
    #controlsComponent: ControlsComponent;
    #damage: number;
    #impactFrame: number;

    constructor(
        gameObject: Phaser.Physics.Arcade.Sprite,
        stateMachine: StateMachine,
        controlsComponent: ControlsComponent,
        animKey: string,
        damage: number = 25,
        impactFrame: number = 3,
    ) {
        super(gameObject, stateMachine);
        this.#controlsComponent = controlsComponent;
        this.#animKey = animKey;
        this.#damage = damage;
        this.#impactFrame = impactFrame;
    }

    onEnter(_previousState: State | null): void {
        const selected = Interactibles.currentSelected;

        this.gameObject.setVelocity(0, 0);
        this.gameObject.play({ key: this.#animKey, repeat: -1 }, true);

        if (selected && !selected.isDead) {
            const onFrame = (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                if (frame.index === this.#impactFrame) { // impact frame
                    selected.takeDamage(this.#damage);

                    if (selected instanceof Tree) {
                        selected.playInteractAnimation();
                        this.gameObject.scene.sound.play('AXE_SOUND');
                    } else if (selected instanceof Ore) {
                        selected.update();
                        this.gameObject.scene.sound.play('PICKAXE_SOUND');
                    } else if (selected instanceof Machine) {
                        this.gameObject.scene.sound.play('PLACING_SOUND'); // swap for a hammer sound if you add one
                    }
                }
            };
            this.gameObject.on('animationupdate', onFrame);
        }
    }

    onUpdate(): void {
        const controls = this.#controlsComponent.controls;
        const isMoving = controls.isLeftDown || controls.isRightDown || controls.isUpDown || controls.isDownDown;
        const selected = Interactibles.currentSelected;

        if (isMoving || !selected || selected.isDead) {
            this.gameObject.off('animationupdate');
            this.gameObject.scene.sound.stopAll();
            Interactibles.clearSelected();
            this.stateMachine.setState(
            isMoving
                ? new MoveState(this.gameObject, this.stateMachine, this.#controlsComponent)
                : new IdleState(this.gameObject, this.stateMachine, this.#controlsComponent),
            );
        }
    }
}