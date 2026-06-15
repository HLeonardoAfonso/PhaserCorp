import { Machine } from "./machine";
import type { InteractiblesConfig } from "./interactibles";
import type { StackData, Direction } from "../common/types";
import { PRICES } from "./machines/processes";
import { registry } from "../systems/machine-registry";

export class Shop extends Machine {

    get resourceKey(): string { return 'SHOP'; }

    #points = -1000000;

    get points(): number { return this.#points; }

    addPoints(amount: number): void {
        this.#points += amount;
        this.scene.sound.play('COIN_SOUND');
    }

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'SHOP', true);
        this.playIdleAnimation();
        this.setBodySize(320, 192); // 5x3
        this.body?.setOffset(64, 192);
        this.setDepth(config.position.y);

        this.removeInteractive();
        const selection = new Phaser.Geom.Rectangle(64, 3*64, 5*64, 3*64);
        this.hitRect = selection;
        this.setInteractive(selection, Phaser.Geom.Rectangle.Contains);

        // Register at all tile positions the shop body covers
        for (let dx = -2; dx <= 2; dx++) {              // 2 tiles before and after the center
            for (let dy = 0; dy <= 2; dy++) {          // 1 tile above and below
                registry.registerAt(this, this.x + dx * 64, this.y + dy * 64);
                config.scene.add.rectangle(this.x + dx * 64, this.y + dy * 64, 64, 64, 0x00ff00, 0.3).setDepth(9999);
            }
        }
    }

    acceptItem(stack: StackData): boolean {

        const price = PRICES.get(stack.itemKey!);

        if (price) {
            this.addPoints(price * stack.amount);
            return true;
        }
        return false;
    }

    canReceiveFrom(_dir: Direction): boolean {
        return true;
    }

    update(_delta: number): void {
        this.checkDeath();
    }
}