import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe, Direction, StackData } from "../../common/types";
import { FUEL_ITEMS, SMELT_MAP } from "./processes";

export class Furnace extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'IRON_ITEM', amount: 2, }, 
    ];    
    static readonly craftItemKey = 'MACHINE_FURNACE';
    static readonly craftDisplayKey = 'FURNACE';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly SMELT_TIME = 2000;

    get resourceKey(): string { return 'MACHINE_FURNACE'; }

    #smeltingProgress = 0;
    #currentSmeltTarget: string | null = null; // result itemKey of current recipe

    #oreSlot: StackData = { itemKey: null, amount: 0 };
    #fuelSlot: StackData = { itemKey: null, amount: 0 };
    #outputSlot: StackData = { itemKey: null, amount: 0 };

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'FURNACE', true);
        this.setOrigin(Furnace.displayOrigin.x, Furnace.displayOrigin.y);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 32)
        this.setDepth(config.position.y);

        this.stacks.push(this.#oreSlot);
        this.stacks.push(this.#fuelSlot);
        this.stacks.push(this.#outputSlot);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 64, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }
    
    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }

    acceptItem(stack: StackData): boolean {
        const leftover = this.routingStack(stack);
        // Accept only if all items were placed (no leftover)
        return leftover.itemKey === null;
    }

    canReceiveFrom(_dir: Direction): boolean {
        // all directions
        return true;
    }

    update(delta: number): void {
        this.checkDeath();
        if (this.isDead) return;

        // has both fuel and ore
        if (this.hasInputs()) {
            
            // output empty
            if (this.isOutputEmpty()) {
            // any ore is ok
            // 
            }
            // output can recive
                // same ore only
            if (this.outputCanRecive()){

            }
            const target = this.#oreSlot.itemKey ? SMELT_MAP.get(this.#oreSlot.itemKey) : null;

            if (target) {
                // If this is a different recipe than what we were working on, reset progress
                if (this.#currentSmeltTarget !== target) {
                    this.#smeltingProgress = 0;
                    this.#currentSmeltTarget = target;
                }

                this.#smeltingProgress += delta;

                if (this.#smeltingProgress >= Furnace.SMELT_TIME) {
                    // Complete one smelt cycle
                    this.#smeltingProgress = 0;

                    this.consumeItem(this.#fuelSlot);
                    this.consumeItem(this.#oreSlot);

                    // Produce 1 result in output
                    if (this.#outputSlot.itemKey === null) {
                        this.#outputSlot.itemKey = target;
                        this.#outputSlot.amount = 1;
                    } else if (this.#outputSlot.itemKey === target) {
                        this.#outputSlot.amount = Math.min(this.#outputSlot.amount + 1, 64);
                    }
                }
            }
        }
    }

    private hasInputs(): boolean {
        return  this.#fuelSlot.amount > 0 
            && this.#oreSlot.amount > 0
            && this.#oreSlot.itemKey !== null
            && SMELT_MAP.has(this.#oreSlot.itemKey);
    }

    private isOutputEmpty(): boolean {
        return this.#outputSlot.amount == 0;
    }

    private outputCanRecive(): boolean {
        return this.#outputSlot.amount < 64 
            && this.#oreSlot.itemKey !== null    
            && this.#outputSlot.itemKey === SMELT_MAP.get(this.#oreSlot.itemKey);
    }

    private consumeItem(slot: StackData): void {
        slot.amount -= 1;
        if (slot.amount <= 0) {
            slot.itemKey = null;
            slot.amount = 0;
        }
    }

    private routingStack(stack: StackData): StackData {
        if (!stack.itemKey) return stack;

        // ores - slot 0
        if (SMELT_MAP.has(stack.itemKey)) {
            return this.insertIntoSlot(0, stack);
        }

        // fuel - slot 1
        if (FUEL_ITEMS.includes(stack.itemKey)) {
            return this.insertIntoSlot(1, stack);
        }

        // Unknown item — reject
        return stack;
    }
}