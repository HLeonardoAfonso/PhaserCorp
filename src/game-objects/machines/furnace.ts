import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe, Direction, StackData } from "../../common/types";
import { FUEL_ITEMS, SMELT_MAP } from "./processes";
import { OPPOSITE, DIRECTIONS } from "../../common/const";
import { registry } from "../../systems/machine-registry";

export class Furnace extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'IRON_ITEM', amount: 2, }, 
    ];    
    static readonly craftItemKey = 'MACHINE_FURNACE';
    static readonly craftDisplayKey = 'FURNACE';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly SMELT_TIME = 500;

    get resourceKey(): string { return 'MACHINE_FURNACE'; }

    #smeltingProgress = 0;
    #currSmeltOutput: string | undefined;

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

        if (this.isProcessing()) {
            this.continueProcess(delta);
            
        } else if (this.hasInputs() && (this.isOutputEmpty() || this.outputCanRecive())) {
            
            this.#currSmeltOutput = SMELT_MAP.get(this.#oreSlot.itemKey!);
            this.consumeItem(this.#fuelSlot);
            this.consumeItem(this.#oreSlot);
            this.continueProcess(delta);
        }
        this.#pushOutputToNeighbor();
    }

    #pushOutputToNeighbor(): void {
        if (this.#outputSlot.itemKey === null) return;

        for (const dir of DIRECTIONS) {
            
            const neighbor = registry.getNeighbor(this, dir);
            
            if (!neighbor) continue;
            if (!neighbor.canReceiveFrom(OPPOSITE[dir])) continue;

            const stack: StackData = {
                itemKey: this.#outputSlot.itemKey,
                amount: 1,
            };
            if (neighbor.acceptItem(stack)) {
                this.#outputSlot.amount -= 1;
                if (this.#outputSlot.amount <= 0) {
                    this.#outputSlot.itemKey = null;
                    this.#outputSlot.amount = 0;
                }
                return;
            }
        }
    }

    private continueProcess(delta: number): void {
        
        this.#smeltingProgress += delta;

        if (this.#smeltingProgress >= Furnace.SMELT_TIME) {

            if (this.isOutputEmpty()) {
                this.#outputSlot.itemKey = this.#currSmeltOutput!;
                this.#outputSlot.amount = 1;
            } else {
                this.#outputSlot.amount += 1;
            }
            this.#smeltingProgress = 0;
        }
    }

    private isProcessing(): boolean {
        return this.#smeltingProgress > 0;
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