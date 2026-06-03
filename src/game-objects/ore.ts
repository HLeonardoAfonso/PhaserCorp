import { Interactibles, type InteractiblesConfig } from "./interactibles";

export abstract class Ore extends Interactibles {
    abstract get resourceKey(): string;

    constructor(config: InteractiblesConfig, health: number, assetKey: string) {
        super(config, health, assetKey);
        this.setDepth(config.position.y);
    }

    playIdleAnimation(): void {
    }

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