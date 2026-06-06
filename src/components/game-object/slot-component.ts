import Phaser from 'phaser';

export class Slot {

    readonly x: number;
    readonly y: number;
    #image: Phaser.GameObjects.Image | null = null;
    #amountText: Phaser.GameObjects.Text | null = null;
    #itemKey: string | null = null;
    #amount = 0;
    #scene: Phaser.Scene;
    #parentVisible: boolean;
    #onClick: ((itemKey: string) => void) | null = null;
    #interactive = false;

    constructor(scene: Phaser.Scene, x: number, y: number, parentVisible: boolean, interactive = false) {
        this.x = x;
        this.y = y;
        this.#scene = scene;
        this.#parentVisible = parentVisible;
        this.#interactive = interactive;
    }

    get itemKey(): string | null { return this.#itemKey; }
    get amount(): number { return this.#amount; }
    get occupied(): boolean { return this.#itemKey !== null && this.#amount > 0; }

    set onClick(cb: ((itemKey: string) => void) | null) { this.#onClick = cb; }

    /** Increment an existing stack by 1. Slot must already be occupied. */
    addOne(): boolean {
        if (this.#amount <= 0) return false;
        this.#amount++;
        this.#amountText?.setText(`${this.#amount}`);
        return true;
    }

    /** Place a new item into an empty slot. Slot must be empty. */
    addNew(itemKey: string): boolean {
        if (this.#amount > 0) return false;

        this.#itemKey = itemKey;
        this.#amount = 1;

        this.#image = this.#scene.add.image(this.x, this.y, itemKey)
            .setScrollFactor(0)
            .setDepth(1002)
            .setVisible(this.#parentVisible);

        this.#amountText = this.#scene.add.text(this.x + 34, this.y + 36, '1', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        })
            .setOrigin(1, 1)
            .setScrollFactor(0)
            .setDepth(1003)
            .setVisible(this.#parentVisible);

        if (this.#interactive) {
            this.#image.setInteractive();
            const self = this;
            this.#image.on('pointerdown', () => {
                if (self.#onClick && self.#itemKey) {
                    self.#onClick(self.#itemKey);
                }
            });
        }

        return true;
    }

  /** Decrease by 1. Destroys visuals if amount reaches 0. */
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

  /** Set visibility of image + text. */
  setVisible(visible: boolean): void {
    this.#parentVisible = visible;
    this.#image?.setVisible(visible);
    this.#amountText?.setVisible(visible);
  }

  /** Destroy all game objects and reset state. */
  destroy(): void {
    this.#image?.destroy();
    this.#amountText?.destroy();
    this.#image = null;
    this.#amountText = null;
    this.#itemKey = null;
    this.#amount = 0;
  }
}