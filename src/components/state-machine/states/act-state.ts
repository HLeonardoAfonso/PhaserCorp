import Phaser from "phaser";
import { State } from "../state";
import type { StateMachine } from "../state-machine";
import { IdleState } from "./idle-state";
import type { ControlsComponent } from "../../game-object/controls-component";
import type { Player } from "../../../game-objects/player";

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
        const interactible = (this.gameObject as Player).nearInteractible;
        this.gameObject.setVelocity(0, 0);
        this.gameObject.play({ key: this.#animKey, repeat: 0 }, true);
        
        const onFrame = (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (frame.index === 3) { // frame do impacto do machado
                interactible?.playInteractAnimation();
                this.gameObject.off('animationupdate', onFrame);
            }
        }

        this.gameObject.on('animationupdate', onFrame);

        this.gameObject.once(`animationcomplete-${this.#animKey}`, () => {
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
        // Do nothing, waiting for animation to complete
    }
}