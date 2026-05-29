import Phaser from 'phaser';
import { KeyboardComponent } from '../input/keyboard-component';

type InventorySlot = {
  x: number;
  y: number;
  occupied: boolean;
  itemKey: string | null;
  amount: number;
  image: Phaser.GameObjects.Image | null;
  amountText: Phaser.GameObjects.Text | null;
};

export class Inventory {

  static MAX_STACK_SIZE = 64;
  
  #banner: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #scene: Phaser.Scene;
  #slots: InventorySlot[] = [];
  #debugRects: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, controls: KeyboardComponent, debug: boolean) {
    this.#scene = scene;
    this.#controls = controls;
    this.#banner = scene.add.image(
      (scene.cameras.main.centerX)-200,
      scene.cameras.main.centerY,
      'INVENTORY_BANNER'
    )
      .setScrollFactor(0)
      .setDepth(1000)
      .setVisible(false);

    this.#initSlotData(scene, debug);
  }

  #initSlotData(scene: Phaser.Scene, debug: boolean): void {
    const topLeftX = this.#banner.x - this.#banner.displayWidth / 2;
    const topLeftY = this.#banner.y - this.#banner.displayHeight / 2;
    const offsetX = 64;
    const offsetY = 64;
    const slotSize = 64;
    const gridCols = 5;
    const gridRows = 5;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cx = topLeftX + offsetX + col * slotSize + slotSize / 2;
        const cy = topLeftY + offsetY + row * slotSize + slotSize / 2;

        this.#slots.push({
          x: cx,
          y: cy,
          occupied: false,
          itemKey: null,
          image: null,
          amountText: null,
          amount: 0,
        });

        if (debug) {
          const rect = scene.add.rectangle(cx, cy, slotSize, slotSize)
            .setStrokeStyle(1, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(1001)
            .setVisible(false);
          this.#debugRects.push(rect);
        }
      }
    }
  }

  get isOpen(): boolean {
    return this.#banner.visible;
  }

  toggle(): void {
    const visible = !this.#banner.visible;
    this.#banner.setVisible(visible);
    this.#debugRects.forEach(r => r.setVisible(visible));
    this.#slots.forEach(s => {
      s.image?.setVisible(visible);
      s.amountText?.setVisible(visible);
    });
  }

  handleInput(): void {
    if (this.#controls.isEKeyJustDown) {
      this.toggle();
    }
  }

  addItems(itemKey: string, quantity: number): boolean {
    for (let i = 0; i < quantity; i++) {
      if (!this.addItem(itemKey)) return false;
    }
    return true;
  }

  addItem(itemKey: string): boolean {
    // Try to stack onto an existing slot with the same item
    let existingSlot: InventorySlot | undefined;
    for (const slot of this.#slots) {
      if (slot.itemKey === itemKey && slot.amount < Inventory.MAX_STACK_SIZE) {
        existingSlot = slot;
        break;
      }
    }
    if (existingSlot) {
      existingSlot.amount++;
      existingSlot.amountText?.setText(`${existingSlot.amount}`);
      return true;
    }

    // Use the first empty slot
    const emptySlot = this.#slots.find(s => !s.occupied);
    if (!emptySlot) return false;

    const image = this.#scene.add.image(emptySlot.x, emptySlot.y, itemKey)
      .setScrollFactor(0)
      .setDepth(1002)
      .setVisible(this.#banner.visible);

    const amountText = this.#scene.add.text(emptySlot.x + 34, emptySlot.y + 36, '1', {
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(1003)
      .setVisible(this.#banner.visible);

    emptySlot.occupied = true;
    emptySlot.itemKey = itemKey;
    emptySlot.image = image;
    emptySlot.amountText = amountText;
    emptySlot.amount = 1;
    return true;
  }
}