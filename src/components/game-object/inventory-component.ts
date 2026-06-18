import Phaser from 'phaser';
import { KeyboardComponent } from '../input/keyboard-component';
import { Slot } from './slot-component';
import { DEPTH } from '../../common/depth';
import type { StackData } from '../../common/types';

export class Inventory {

  #banner: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #slots: Slot[] = [];

  /** Callback invoked when a player clicks on an inventory slot. */
  onSlotClick: ((itemKey: string, shiftKey: boolean) => void) | null = null;

  constructor(scene: Phaser.Scene, controls: KeyboardComponent, debug: boolean) {
    this.#controls = controls;
    this.#banner = scene.add.image(
      (scene.cameras.main.centerX)-200,
      scene.cameras.main.centerY,
      'INVENTORY_BANNER'
    )
      .setScrollFactor(0)
      .setDepth(DEPTH.TABLE_BG)
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

        const slot = new Slot(scene, cx, cy, false, true, debug);
        slot.onClick = (itemKey, shiftKey) => {
          if (this.onSlotClick) {
            this.onSlotClick(itemKey, shiftKey);
          }
        };
        this.#slots.push(slot);
      }
    }
  }

  get isOpen(): boolean {
    return this.#banner.visible;
  }

  getSlotsData(): StackData[] {
    return this.#slots.map(s => ({ itemKey: s.itemKey, amount: s.amount }));
  }

  setSlotsData(data: StackData[]): void {
    for (let i = 0; i < data.length; i++) {
      this.addItems(data[i].itemKey!, data[i].amount);
    }
  }

  toggle(): void {
    const visible = !this.#banner.visible;
    this.#banner.setVisible(visible);
    this.#slots.forEach(s => s.setVisible(visible));
  }

  handleInput(): void {
    if (this.#controls.isEKeyJustDown) {
      this.toggle();
    }
  }

  addItems(itemKey: string, quantity: number): boolean {
    for (let i = 0; i < quantity; i++) {
      if (!this.addOneItem(itemKey)) return false;
    }
    return true;
  }

  addOneItem(itemKey: string): boolean {

    // add to existing stack if possible 
    for (const slot of this.#slots) {
      if (slot.itemKey === itemKey && slot.amount < 64) {
        return slot.addOne();
      }
    }
    // else use empty slot
    for (const slot of this.#slots) {
      if (!slot.occupied) {
        return slot.addNew(itemKey);
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

  /** Return the total quantity of the given item across all inventory slots. */
  countAllOf(itemKey: string): number {
    let total = 0;
    for (const slot of this.#slots) {
      if (slot.itemKey === itemKey) {
        total += slot.amount;
      }
    }
    return total;
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