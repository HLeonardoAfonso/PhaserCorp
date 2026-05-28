import Phaser from 'phaser';
import { KeyboardComponent } from '../input/keyboard-component';

type CraftingSlot = {
  x: number;
  y: number;
  occupied: boolean;
  itemKey: string | null;
  image: Phaser.GameObjects.Image | null;
};

const MACHINE_LIST = ['FURNACE', 'CONVEYOR', 'CONVEYOR_CURVE'] as const;

export class Crafting {

  static readonly PAPER_FRAMES = [[0, 2], [6, 8]];
  
  #table: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #slots: CraftingSlot[] = [];
  #debugRects: Phaser.GameObjects.Rectangle[] = [];
  #paperSprites: Phaser.GameObjects.Sprite[][] = [];
  #isHovering = false;

  constructor(scene: Phaser.Scene, controls: KeyboardComponent, debug: boolean) {
    this.#controls = controls;

    this.#table = scene.add.image(
      (scene.cameras.main.centerX)+200,
      scene.cameras.main.centerY,
      'INVENTORY_TABLE'
    )
      .setScrollFactor(0)
      .setDepth(1000)
      .setVisible(false);

    this.#paperSprites = Crafting.PAPER_FRAMES.map(row =>
      row.map(frame =>
        scene.add.sprite(0, 0, 'PAPER', frame)
          .setScrollFactor(0)
          .setDepth(1100)
          .setVisible(false)
      )
    );

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.#isHovering) {
        this.#showPaperSprites(pointer);
      }
    });

    this.#initSlotData(scene, debug);
    this.#populateMachines(scene);
  }

  #onMachinePointerOver(_index: number, pointer: Phaser.Input.Pointer): void {
    this.#isHovering = true;
    this.#showPaperSprites(pointer);
  }

  #onMachinePointerOut(): void {
    this.#isHovering = false;
    this.#hidePaperSprites();
  }

  #showPaperSprites(pointer: Phaser.Input.Pointer): void {
    const offsetX = 20;
    const offsetY = -80;
    const spacing = 48;
    const lineHeight = 64;

    this.#paperSprites.forEach((row, ri) => {
      row.forEach((sprite, ci) => {
        sprite.setPosition(
          pointer.x + offsetX + ci * spacing,
          pointer.y + offsetY + ri * lineHeight
        );
        sprite.setVisible(true);
      });
    });
  }

  #hidePaperSprites(): void {
    this.#paperSprites.forEach(row =>
      row.forEach(sprite => sprite.setVisible(false))
    );
  }

  #populateMachines(scene: Phaser.Scene): void {
    for (let i = 0; i < MACHINE_LIST.length && i < this.#slots.length; i++) {
      const slot = this.#slots[i];
      const image = scene.add.image(slot.x, slot.y, MACHINE_LIST[i])
        .setScrollFactor(0)
        .setDepth(1002)
        .setVisible(this.#table.visible)
        .setInteractive()
        .on('pointerover', (pointer: Phaser.Input.Pointer) => this.#onMachinePointerOver(i, pointer))
        .on('pointerout', () => this.#onMachinePointerOut());

      slot.occupied = true;
      slot.itemKey = MACHINE_LIST[i];
      slot.image = image;
    }
  }

  #initSlotData(scene: Phaser.Scene, debug: boolean): void {
    const topLeftX = this.#table.x - this.#table.displayWidth / 2;
    const topLeftY = this.#table.y - this.#table.displayHeight / 2;
    const offsetX = 64;
    const offsetY = 64;
    const slotSize = 128;
    const gridCols = 3;
    const gridRows = 2;

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
    return this.#table.visible;
  }

  toggle(): void {
    const visible = !this.#table.visible;
    this.#table.setVisible(visible);
    this.#debugRects.forEach(r => r.setVisible(visible));
    this.#slots.forEach(s => {
      s.image?.setVisible(visible);
    });

    if (!visible) {
      this.#isHovering = false;
      this.#hidePaperSprites();
    }
  }

  handleInput(): void {
    if (this.#controls.isEKeyJustDown) {
      this.toggle();
    }
  }

}