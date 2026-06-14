import Phaser from 'phaser';
import { MachineInterface } from './machine-interface-component';
import { DEPTH } from '../../common/depth';

export class ShopInterface extends MachineInterface {

    #overlay: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        super(scene, 'INVENTORY_TABLE');

        this.#overlay = scene.add.image(this.table.x, this.table.y, 'SHOP_OVERLAY')
            .setScrollFactor(0)
            .setDepth(DEPTH.SLOT_TEXT)
            .setVisible(false);
    }

    open(): void {
        this.toggleDisplay(true);
        this.#overlay.setVisible(true);
    }

    toggleDisplay(bool: boolean): void {
        super.toggleDisplay(bool);
        this.#overlay.setVisible(bool);
    }

    close(): void {
        super.close();
        this.#overlay.setVisible(false);
    }
}