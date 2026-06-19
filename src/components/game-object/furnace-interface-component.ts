import Phaser from 'phaser';
import type { Position } from "../../common/types";
import { Slot } from './slot-component';
import { MachineInterface } from './machine-interface-component';
import { Machine } from '../../game-objects/machine';

export class FurnaceInterface extends MachineInterface {

  #slots: Slot[] = [];
  #machine: Machine | null = null;

  // Callback fired when any slot is clicked
  onSlotTransfer: ((slotIndex: number, itemKey: string, amount: number) => void) | null = null;

  constructor(scene: Phaser.Scene, debug: boolean) {
    super(scene);
    this.#initSlotData(scene, debug);
  }

  #initSlotData(scene: Phaser.Scene, debug: boolean): void {
    const topLeftX = this.table.x - this.table.displayWidth / 2;
    const topLeftY = this.table.y - this.table.displayHeight / 2;
    const size = 64;

    // Furnace-specific slot configurations
    const slotPositions: Position[] = [
      { x: 90,  y: 129 },  // ore slot
      { x: 90,  y: 258 },  // fuel slot
      { x: 367, y: 192 },  // output slot
    ];

    // Create input/output slots from config data
    this.#slots = slotPositions.map(({ x, y }, index) => {
      const slot = new Slot(scene, topLeftX + x + size / 2, topLeftY + y + size / 2, false, true, debug);
      slot.onClick = (itemKey, shiftKey) => {
        if (!this.#machine || !this.onSlotTransfer) return;
        const stack = this.#machine.stacks[index];
        if (stack.amount > 0) {
          const amount = shiftKey ? stack.amount : 1;
          this.onSlotTransfer(index, itemKey, amount);
        }
      };
      return slot;
    });
  }

  toggleDisplay(bool: boolean): void {
    super.toggleDisplay(bool);
    this.#slots.forEach(s => s.setVisible(bool));
  }

  // Bind this interface to a specific Machine instance
  bind(machine: Machine): void {
    this.#machine = machine;
    this.open(machine.texture.key);
    this.update();
  }

  // Drop the current machine reference
  unbind(): void {
    this.#machine = null;
  }

  get currentMachine(): Machine | null {
    return this.#machine;
  }

  update(): void {
    if (!this.#machine) return;
    const stacks = this.#machine.stacks;
    for (let i = 0; i < this.#slots.length; i++) {
      const stack = stacks[i];
      if (!stack) {
        this.#slots[i].sync(null, 0);
        continue;
      }
      this.#slots[i].sync(stack.itemKey, stack.amount);
    }
  }


  tryAddToInput(itemKey: string): boolean {
    return this.tryAddToInputAmount(itemKey, 1) === 1;
  }

  tryAddToInputAmount(itemKey: string, amount: number): number {
    if (!this.#machine) return 0;
    let accepted = 0;
    for (let i = 0; i < amount; i++) {
      if (this.#machine.acceptItem({ itemKey, amount: 1 })) {
        accepted++;
      } else {
        break;
      }
    }
    return accepted;
  }
}