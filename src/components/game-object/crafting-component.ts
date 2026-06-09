import Phaser from 'phaser';
import type { Recipe } from '../../common/types';
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

type CraftableEntry = {
  craftRecipe: Recipe;
  craftItemKey: string;
  craftDisplayKey: string;
};

const CRAFTABLE_MACHINES = [Furnace, Conveyer, ConveyerCurve] as const;

const CRAFTABLE_ITEMS: CraftableEntry[] = [
  {
    craftRecipe: [{ itemKey: 'COPPER_ITEM', amount: 1 }],
    craftItemKey: 'COPPER_PLATE',
    craftDisplayKey: 'COPPER_PLATE',
  },
  {
    craftRecipe: [{ itemKey: 'COPPER_PLATE', amount: 1 }],
    craftItemKey: 'COPPER_WIRE',
    craftDisplayKey: 'COPPER_WIRE',
  },
];

export class Crafting {
  
  #table: Phaser.GameObjects.Image;
  #controls: KeyboardComponent;
  #inventory: Inventory;
  #slots: CraftingSlot[] = [];
  #debugRects: Phaser.GameObjects.Rectangle[] = [];
  #recipeOverlay: RecipeOverlay;

  // Combine machines (as CraftableEntry) and item entries into a single list
  readonly #entries: CraftableEntry[] = [
    ...CRAFTABLE_MACHINES.map(cls => ({
      craftRecipe: cls.craftRecipe,
      craftItemKey: cls.craftItemKey,
      craftDisplayKey: cls.craftDisplayKey,
    })),
    ...CRAFTABLE_ITEMS,
  ];

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
    this.#populateCraftingGrid(scene);
  }

  #onCraftablePointerOver(index: number, pointer: Phaser.Input.Pointer): void {
    const entry = this.#entries[index];
    this.#recipeOverlay.show(pointer, entry.craftRecipe);
  }

  #onCraftablePointerOut(): void {
    this.#recipeOverlay.hide();
  }

  #onCraftableClick(index: number): void {
    const entry = this.#entries[index];
    const recipe = entry.craftRecipe;
    const itemKey = entry.craftItemKey;

    // Check if player has enough of each ingredient
    for (const ingredient of recipe) {
      if (!ingredient.itemKey) return;
      if (!this.#inventory.hasEnoughOf(ingredient.itemKey, ingredient.amount)) {
        return; // Not enough resources, abort
      }
    }

    // Remove ingredients
    for (const ingredient of recipe) {
      if (!ingredient.itemKey) return;
      this.#inventory.removeItems(ingredient.itemKey, ingredient.amount);
    }

    // Add the crafted item to inventory
    this.#inventory.addItems(itemKey, 1);
  }

  #populateCraftingGrid(scene: Phaser.Scene): void {
    for (let i = 0; i < this.#entries.length && i < this.#slots.length; i++) {
      const entry = this.#entries[i];
      const slot = this.#slots[i];
      const image = scene.add.image(slot.x, slot.y, entry.craftDisplayKey)
        .setScrollFactor(0)
        .setDepth(1002)
        .setVisible(this.#table.visible)
        .setInteractive()
        .on('pointerover', (pointer: Phaser.Input.Pointer) => this.#onCraftablePointerOver(i, pointer))
        .on('pointerout', () => this.#onCraftablePointerOut())
        .on('pointerdown', () => this.#onCraftableClick(i));

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