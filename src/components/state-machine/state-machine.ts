import { State } from "./state";

export class StateMachine {
    #currentState: State | null = null;

    constructor(_gameObject: Phaser.GameObjects.GameObject) {
        // gameObject is stored for future use
    }

    get currentState(): State | null {
        return this.#currentState;
    }

    setState(newState: State): void {
        const previousState = this.#currentState;
        this.#currentState = newState;
        newState.onEnter(previousState);
    }

    update(): void {
        if (!this.#currentState) return;
        this.#currentState.onUpdate();
    }
}
