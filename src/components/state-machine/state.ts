import type { StateMachine } from "./state-machine";

export abstract class State {
    protected gameObject: Phaser.GameObjects.GameObject;
    protected stateMachine: StateMachine;

    constructor(gameObject: Phaser.GameObjects.GameObject, stateMachine: StateMachine) {
        this.gameObject = gameObject;
        this.stateMachine = stateMachine;
    }

    abstract onEnter(previousState: State | null): void;
    abstract onUpdate(): void;
}
