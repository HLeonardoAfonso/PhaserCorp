import Phaser from 'phaser';
import { DEPTH } from '../../common/depth';
import { MACHINE_TEXTURE_KEYS } from '../../game-objects/machines/processes';

export class Slot {

  readonly x: number;
  readonly y: number;
  #image: Phaser.GameObjects.Image | null = null;
  #amountText: Phaser.GameObjects.Text | null = null;
  #itemKey: string | null = null;
  #amount = 0;
  #debugRect: Phaser.GameObjects.Rectangle | null = null;
  #scene: Phaser.Scene;
  #parentVisible: boolean;
  #onClick: ((itemKey: string, shiftKey: boolean) => void) | null = null;
  #interactive = false;

  constructor(scene: Phaser.Scene, x: number, y: number, parentVisible: boolean, interactive = false, debug = false) {
    this.x = x;
    this.y = y;
    this.#scene = scene;
    this.#parentVisible = parentVisible;
    this.#interactive = interactive;

    if (debug) {
      this.#debugRect = scene.add.rectangle(x, y, 64, 64)
        .setStrokeStyle(1, 0x000000, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.SLOT_DEBUG)
        .setVisible(parentVisible);
    }
  }

  get itemKey(): string | null { return this.#itemKey; }
  get amount(): number { return this.#amount; }
  get occupied(): boolean { return this.#itemKey !== null && this.#amount > 0; }

  set onClick(cb: ((itemKey: string, shiftKey: boolean) => void) | null) { this.#onClick = cb; }

  addOne(): boolean {
    if (this.#amount <= 0) return false;
    this.#amount++;
    this.#amountText?.setText(`${this.#amount}`);
    return true;
  }

  addNew(itemKey: string): boolean {
    if (this.#amount > 0) return false;

    this.#itemKey = itemKey;
    this.#amount = 1;

    this.#image = this.#scene.add.image(this.x, this.y, itemKey)
        .setScrollFactor(0)
        .setDepth(DEPTH.SLOT_IMAGE)
        .setVisible(this.#parentVisible)
        .setScale(MACHINE_TEXTURE_KEYS.has(itemKey) ? 0.5 : 1);

    this.#amountText = this.#scene.add.text(this.x + 34, this.y + 36, '1', {
        fontSize: '16px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
    })
        .setOrigin(1, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.SLOT_TEXT)
        .setVisible(this.#parentVisible);

    if (this.#interactive) {
      this.#image.setInteractive();
      const self = this;
      this.#image.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (self.#onClick && self.#itemKey) {
          const shiftDown = pointer.event?.shiftKey ?? false;
          self.#onClick(self.#itemKey, shiftDown);
        }
      });
    }
    return true;
  }

  removeOne(): boolean {
    if (this.#amount <= 0) return false;
    this.#amount--;
    if (this.#amount <= 0) {
      this.destroy();
    } else {
      this.#amountText?.setText(`${this.#amount}`);
    }
    return true;
  }

  setVisible(visible: boolean): void {
    this.#parentVisible = visible;
    this.#image?.setVisible(visible);
    this.#amountText?.setVisible(visible);
    this.#debugRect?.setVisible(visible);
  }

  sync(itemKey: string | null, amount: number): void {
    const targetKey = itemKey;
    const targetAmount = Math.max(0, amount | 0);

    if (targetKey === null || targetAmount <= 0) {
      if (this.#amount > 0 || this.#itemKey !== null) {
        this.destroy();
      }
      return;
    }

    if (this.#itemKey !== targetKey) {
      if (this.#itemKey !== null) {
        this.destroy();
      }
      this.addNew(targetKey);
      if (this.#amountText) {
        this.#amountText.setText(`${targetAmount}`);
      }
      this.#amount = targetAmount;
      return;
    }

    if (this.#amount !== targetAmount && this.#amountText) {
      this.#amountText.setText(`${targetAmount}`);
    }
    this.#amount = targetAmount;
  }

  clear(): void {
    this.#image?.setVisible(false);
    this.#amountText?.setVisible(false);
    this.#itemKey = null;
    this.#amount = 0;
  }

  destroy(): void {
    this.#debugRect?.destroy();
    this.#debugRect = null;
    this.#image?.destroy();
    this.#amountText?.destroy();
    this.#image = null;
    this.#amountText = null;
    this.#itemKey = null;
    this.#amount = 0;
  }
}
