import Phaser from 'phaser';
import type { Position } from "../../common/types";
import { Slot } from './slot-component';

export class MachineInterface {
  
  #scene: Phaser.Scene;
  #table: Phaser.GameObjects.Image;
  #slots: Slot[] = [];
  #machineImage: Phaser.GameObjects.Image | null = null;
  #debugRects: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, _controls: unknown, _inventory: unknown, debug: boolean) {
    this.#scene = scene;

    this.#table = scene.add.image(
      (scene.cameras.main.centerX)+200,
      scene.cameras.main.centerY,
      'MACHINE_TABLE'
    )
      .setScrollFactor(0)
      .setDepth(1000)
      .setVisible(false);

    this.#initSlotData(scene, debug);
  }

  #initSlotData(scene: Phaser.Scene, debug: boolean): void {
    const topLeftX = this.#table.x - this.#table.displayWidth / 2;
    const topLeftY = this.#table.y - this.#table.displayHeight / 2;
    const size = 64;

    // Define slot configurations as declarative data
    const slotPositions: Position[] = [
      { x: 90,  y: 129 },  // input slot 1
      { x: 90,  y: 258},   // input slot 2
      { x: 367, y: 192},   // output slot
    ];

    // Create input/output slots from config data
    this.#slots = slotPositions.map(({ x, y }) =>
      new Slot(scene, topLeftX + x + size / 2, topLeftY + y + size / 2, false, false)
    );

    if (debug) {
      // Create debug rectangles for input/output slots only
      this.#debugRects = this.#slots.map((s) =>
        scene.add.rectangle(s.x, s.y, size, size)
          .setStrokeStyle(1, 0x000000, 0.5)
          .setScrollFactor(0)
          .setDepth(1001)
          .setVisible(false)
      );
    }
  }

  get isOpen(): boolean {
    return this.#table.visible;
  }

  open(textureKey: string): void {
    // Destroy any existing machine image
    this.#machineImage?.destroy();

    // Create new machine image centered on the table
    this.#machineImage = this.#scene.add.image(this.#table.x, this.#table.y, textureKey)
      .setScrollFactor(0)
      .setDepth(1002)
      .setVisible(true);

    // Open the interface via toggleDisplay
    this.toggleDisplay(true);
  }

  toggleDisplay(bool: boolean): void {
    this.#table.setVisible(bool);
    this.#debugRects.forEach(r => r.setVisible(bool));
    this.#slots.forEach(s => s.setVisible(bool));
    this.#machineImage?.setVisible(bool);
  }

  toggle(): void {
    const visible = !this.#table.visible;
    this.toggleDisplay(visible);
  }

  close(): void {
    this.toggleDisplay(false);
  }

  /** Add 1 item to the first input slot (slot index 0). Returns true if placed. */
  addToInputSlot(itemKey: string): boolean {
    const slot = this.#slots[0];
    if (!slot) return false;
    return slot.addOne(itemKey);
  }
}