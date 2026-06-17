import { Interactibles, type InteractiblesConfig } from "./interactibles";
import { oreRegistry } from "../systems/ore-registry";

export abstract class Ore extends Interactibles {
    abstract get resourceKey(): string;

    static onResourceMined: ((resourceKey: string) => void) | null = null;

    constructor(config: InteractiblesConfig, health: number, assetKey: string) {
        super(config, health, assetKey);
        this.setDepth(config.position.y);
        oreRegistry.register(this);
    }

    playIdleAnimation(): void {
    }

    override takeDamage(amount: number): void {
        if (this.isDead) return;
        //Dar um recurso de cada vez ao player por hit
        Ore.onResourceMined?.(this.resourceKey);
        super.takeDamage(amount);
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