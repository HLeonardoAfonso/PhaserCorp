import { Interactibles, type InteractiblesConfig } from "./interactibles";

export abstract class Machine extends Interactibles {

    #Interfaceble: boolean;
    
    constructor(config: InteractiblesConfig, health: number, assetKey: string, interfaceble: boolean) {
        super(config, health, assetKey);
        this.#Interfaceble = interfaceble;
    }

    get interfaceble(): boolean {
        return this.#Interfaceble;
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