import Phaser from 'phaser';
import type { Position } from "../../common/types";
import { Slot } from './slot-component';
import { MachineInterface } from './machine-interface-component';
import { Machine } from '../../game-objects/machine';

const MAX_STACK = 64;

export class FurnaceInterface extends MachineInterface {

  #slots: Slot[] = [];
  #machine: Machine | null = null;

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
      { x: 90,  y: 129 },  // input slot 1
      { x: 90,  y: 258 },  // input slot 2
      { x: 367, y: 192 },  // output slot
    ];

    // Create input/output slots from config data
    this.#slots = slotPositions.map(({ x, y }) =>
      new Slot(scene, topLeftX + x + size / 2, topLeftY + y + size / 2, false, false, debug)
    );
  }

  toggleDisplay(bool: boolean): void {
    super.toggleDisplay(bool);
    this.#slots.forEach(s => s.setVisible(bool));
  }

  /**
   * Bind this interface to a specific Machine instance. The interface
   * becomes a passive viewer of the machine's stacks — every update()
   * call will mirror the machine's stack data onto the visual slots.
   */
  bind(machine: Machine): void {
    this.#machine = machine;
    this.open(machine.texture.key);
    this.update();
  }

  /** Drop the current machine reference. */
  unbind(): void {
    this.#machine = null;
  }

  get currentMachine(): Machine | null {
    return this.#machine;
  }

  /**
   * Pull the latest stack data from the bound machine and apply it to
   * the visual slots. Safe to call every frame.
   */
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

  /** Indices of the input slots (everything except the output slot). */
  static readonly INPUT_INDICES: readonly number[] = [0, 1];

  /**
   * Try to add 1 of `itemKey` to one of the input slots of the bound
   * machine. The output slot is never targeted by this method.
   *
   * Strategy:
   *   1. Stack onto an existing input slot that already holds `itemKey`
   *      and is not full.
   *   2. Otherwise, place it in the first empty input slot.
   *   3. Otherwise, return false (caller should keep the item in inventory).
   *
   * Mutates the machine's stack data — the next update() reflects it visually.
   */
  tryAddToInput(itemKey: string): boolean {
    if (!this.#machine) return false;
    const stacks = this.#machine.stacks;

    // 1. Stack onto a matching non-full input slot.
    for (const i of FurnaceInterface.INPUT_INDICES) {
      const s = stacks[i];
      if (s && s.itemKey === itemKey && s.amount < MAX_STACK) {
        this.#machine.setStack(i, { itemKey, amount: s.amount + 1 });
        return true;
      }
    }
    // 2. Fall back to the first empty input slot.
    for (const i of FurnaceInterface.INPUT_INDICES) {
      const s = stacks[i];
      if (s && (s.itemKey === null || s.amount <= 0)) {
        this.#machine.setStack(i, { itemKey, amount: 1 });
        return true;
      }
    }
    return false;
  }
}
