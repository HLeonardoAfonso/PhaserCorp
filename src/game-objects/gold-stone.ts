import Phaser from "phaser";
import type { InteractiblesConfig } from "./interactibles";
import { Ore } from "./ore";

export class GoldStone extends Ore {
    get resourceKey(): string { return 'GOLD_ITEM'; }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'ORE');
        this.playIdleAnimation();
        this.setBodySize(45, 45);
        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(40, 40, 45, 45);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }

    playIdleAnimation(): void {
        this.play('ORE_IDLE');
    }
}
