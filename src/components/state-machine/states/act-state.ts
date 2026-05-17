import Phaser from "phaser";
import { State } from "../state";
import type { StateMachine } from "../state-machine";
import { IdleState } from "./idle-state";
import type { ControlsComponent } from "../../game-object/controls-component";
import type { Player } from "../../../game-objects/player";
import { Tree } from "../../../game-objects/tree";
import { Interactibles } from "../../../game-objects/interactibles";
import { MoveState } from "./move-state";

export class ActState extends State {
    declare protected gameObject: Phaser.Physics.Arcade.Sprite;
    #animKey: string;
    #controlsComponent: ControlsComponent;

    constructor(
        gameObject: Phaser.Physics.Arcade.Sprite,
        stateMachine: StateMachine,
        controlsComponent: ControlsComponent,
        animKey: string,
    ) {
        super(gameObject, stateMachine);
        this.#controlsComponent = controlsComponent;
        this.#animKey = animKey;
    }

    onEnter(_previousState: State | null): void {
        const selected = Interactibles.currentSelected;

        this.gameObject.setVelocity(0, 0);
        this.gameObject.play({ key: this.#animKey, repeat: -1 }, true);

        if (selected && !selected.isDead && selected instanceof Tree){
            const tree = selected as Tree;
            const onFrame = (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                if (frame.index === 3) { // frame do impacto do machado
                    tree.playInteractAnimation();
                    tree.takeDamage(25);
                    tree.update();
                    this.gameObject.off('animationupdate', onFrame);
                }
            }
            this.gameObject.on('animationupdate', onFrame);
        }
    }

    onUpdate(): void {
        const controls = this.#controlsComponent.controls;
        const isMoving = controls.isLeftDown || controls.isRightDown || controls.isUpDown || controls.isDownDown;
        const tree = Interactibles.currentSelected as Tree;
        if (isMoving || tree.isDead) {
            this.gameObject.off('animationupdate');
            Interactibles.clearSelected();
            this.stateMachine.setState(
            isMoving
                ? new MoveState(this.gameObject, this.stateMachine, this.#controlsComponent)
                : new IdleState(this.gameObject, this.stateMachine, this.#controlsComponent),
            );
        }
    }
}