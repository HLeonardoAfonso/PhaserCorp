import Phaser from "phaser";
import { State } from "../state";
import type { StateMachine } from "../state-machine";
import { IdleState } from "./idle-state";
import type { ControlsComponent } from "../../game-object/controls-component";
import { Tree } from "../../../game-objects/tree";
import { Interactibles } from "../../../game-objects/interactibles";
import { MoveState } from "./move-state";
import { Ore } from "../../../game-objects/ore";

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

        if (selected && !selected.isDead){
            const onFrame = (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                if (frame.index === 3) { // frame do impacto do machado
                    selected.takeDamage(25);
                    if(selected instanceof Tree){
                        (selected as Tree).playInteractAnimation();
                        
                    }
                    if(selected instanceof Ore){
                        (selected as Ore).update();
                    }
                }
            }
            this.gameObject.on('animationupdate', onFrame);
        }
    }

    onUpdate(): void {
        const controls = this.#controlsComponent.controls;
        const isMoving = controls.isLeftDown || controls.isRightDown || controls.isUpDown || controls.isDownDown;
        const selected = Interactibles.currentSelected;
        if (isMoving || !selected || selected.isDead) {
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