import Phaser from "phaser";
import type { InteractiblesConfig } from "../interactibles";
import { Ore } from "../ore";

export class CoalStone extends Ore {
    get resourceKey(): string { return 'COAL_ITEM'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'COAL_STONE');
        this.setBodySize(90, 64);
        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(20, 35, 90, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
}