import Phaser from 'phaser';
import { KeyboardComponent } from '../input/keyboard-component';
import { Slot } from './slot-component';

export class Inventory {

  #banner: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #slots: Slot[] = [];
  #debugRects: Phaser.GameObjects.Rectangle[] = [];

  /** Callback invoked when a player clicks on an inventory slot. */
  onSlotClick: ((itemKey: string) => void) | null = null;

  constructor(scene: Phaser.Scene, controls: KeyboardComponent, debug: boolean) {
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

        const slot = new Slot(scene, cx, cy, false, true);
        slot.onClick = (itemKey) => {
          if (this.onSlotClick) {
            this.onSlotClick(itemKey);
          }
        };
        this.#slots.push(slot);

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
    this.#slots.forEach(s => s.setVisible(visible));
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
    for (const slot of this.#slots) {
      if (slot.itemKey === itemKey && slot.amount < 64) {
        return slot.addOne(itemKey);
      }
    }

    // Use the first empty slot
    for (const slot of this.#slots) {
      if (!slot.occupied) {
        return slot.addOne(itemKey);
      }
    }

    return false;
  }

  hasEnoughOf(itemKey: string, amount: number): boolean {
    let total = 0;
    for (const slot of this.#slots) {
      if (slot.itemKey === itemKey) {
        total += slot.amount;
        if (total >= amount) return true;
      }
    }
    return false;
  }

  removeItems(itemKey: string, amount: number): void {
    let remaining = amount;
    for (const slot of this.#slots) {
      if (remaining <= 0) break;
      if (slot.itemKey === itemKey) {
        const toRemove = Math.min(slot.amount, remaining);
        for (let i = 0; i < toRemove; i++) {
          slot.removeOne();
        }
        remaining -= toRemove;
      }
    }
  }
}