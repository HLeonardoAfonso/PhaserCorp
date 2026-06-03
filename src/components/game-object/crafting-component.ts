import Phaser from 'phaser';
import { KeyboardComponent } from '../input/keyboard-component';
import { RecipeOverlay } from './recipe-component';
import { Inventory } from './inventory-component';
import { Furnace } from '../../game-objects/machines/furnace';
import { Conveyer } from '../../game-objects/machines/conveyer';
import { ConveyerCurve } from '../../game-objects/machines/conveyer-curve';

type CraftingSlot = {
  x: number;
  y: number;
  occupied: boolean;
  image: Phaser.GameObjects.Image | null;
};

const CRAFTABLE_MACHINES = [Furnace, Conveyer, ConveyerCurve] as const;

export class Crafting {
  
  #table: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #inventory: Inventory;
  #slots: CraftingSlot[] = [];
  #debugRects: Phaser.GameObjects.Rectangle[] = [];
  #recipeOverlay: RecipeOverlay;

  constructor(scene: Phaser.Scene, controls: KeyboardComponent, inventory: Inventory, debug: boolean) {
    this.#inventory = inventory;
    this.#controls = controls;

    this.#table = scene.add.image(
      (scene.cameras.main.centerX)+200,
      scene.cameras.main.centerY,
      'INVENTORY_TABLE'
    )
      .setScrollFactor(0)
      .setDepth(1000)
      .setVisible(false);

    this.#recipeOverlay = new RecipeOverlay(scene);
    this.#initSlotData(scene, debug);
    this.#populateMachines(scene);
  }

  #onMachinePointerOver(_index: number, pointer: Phaser.Input.Pointer): void {
    const machineClass = CRAFTABLE_MACHINES[_index];
    this.#recipeOverlay.show(pointer, machineClass.craftRecipe);
  }

  #onMachinePointerOut(): void {
    this.#recipeOverlay.hide();
  }

  #onMachineClick(_index: number): void {
    const machineClass = CRAFTABLE_MACHINES[_index];
    const recipe = machineClass.craftRecipe;
    const itemKey = machineClass.craftItemKey;

    // Check if player has enough of each ingredient
    for (const ingredient of recipe) {
      if (!this.#inventory.hasEnoughOf(ingredient.key, ingredient.amount)) {
        return; // Not enough resources, abort
      }
    }

    // Remove ingredients
    for (const ingredient of recipe) {
      this.#inventory.removeItems(ingredient.key, ingredient.amount);
    }

    // Add the crafted machine item to inventory
    this.#inventory.addItem(itemKey);
  }

  #populateMachines(scene: Phaser.Scene): void {
    for (let i = 0; i < CRAFTABLE_MACHINES.length && i < this.#slots.length; i++) {
      const machineClass = CRAFTABLE_MACHINES[i];
      const slot = this.#slots[i];
      const image = scene.add.image(slot.x, slot.y, machineClass.craftDisplayKey)
        .setScrollFactor(0)
        .setDepth(1002)
        .setVisible(this.#table.visible)
        .setInteractive()
        .on('pointerover', (pointer: Phaser.Input.Pointer) => this.#onMachinePointerOver(i, pointer))
        .on('pointerout', () => this.#onMachinePointerOut())
        .on('pointerdown', () => this.#onMachineClick(i));

      slot.occupied = true;
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
      this.#recipeOverlay.hide();
    }
  }

  handleInput(): void {
    if (this.#controls.isEKeyJustDown) {
      this.toggle();
    }
  }

}