import { Interactibles, type InteractiblesConfig } from "./interactibles";

export abstract class Machine extends Interactibles {

    constructor(config: InteractiblesConfig, health: number) {
        super(config, health);
    }

    playIdleAnimation(): void {}

    update(): void {
        if (this.isDead) {
            Interactibles.clearSelected();
            Interactibles.clearHovered();
            Interactibles.onEntityDied?.(this.resourceKey);
            this.removeInteractive();
            this.destroy();
        }
    }
}