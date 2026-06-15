import { Interactibles, type InteractiblesConfig } from "./interactibles";
import { oreRegistry } from "../systems/ore-registry";

export abstract class Ore extends Interactibles {
    abstract get resourceKey(): string;

    constructor(config: InteractiblesConfig, health: number, assetKey: string) {
        super(config, health, assetKey);
        this.setDepth(config.position.y);
        oreRegistry.register(this);
    }

    playIdleAnimation(): void {
    }

    update(): void {
        if (this.isDead) {
            Interactibles.clearSelected();
            Interactibles.clearHovered();
            Interactibles.onEntityDied?.(this.resourceKey);
            oreRegistry.unregister(this);
            this.removeInteractive();
            this.destroy();
        }
    }
}