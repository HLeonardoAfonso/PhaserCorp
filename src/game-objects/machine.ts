import { Interactibles, type InteractiblesConfig } from "./interactibles";

export abstract class Machine extends Interactibles {

    constructor(config: InteractiblesConfig, health: number, assetKey: string) {
        super(config, health, assetKey);
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