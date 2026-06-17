import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Recipe, Direction, StackData } from "../../common/types";
import { CRAFTING_RECIPES } from "./processes";
import { OPPOSITE, DIRECTIONS } from "../../common/const";
import { registry } from "../../systems/machine-registry";

export class Crafter extends Machine {
    
    static readonly craftRecipe: Recipe = [
        { itemKey: 'IRON_GEAR', amount: 2, },
        { itemKey: 'COPPER_WIRE', amount: 2, },
        { itemKey: 'WOOD_ITEM', amount: 2, }
    ];    
    static readonly craftKey = 'CRAFTER';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly CRAFT_TIME = 500;

    get resourceKey(): string { return 'CRAFTER'; }

    #craftingProgress = 0;
    #currOutput: string | undefined;

    #inputSlot: StackData = { itemKey: null, amount: 0 };
    #outputSlot: StackData = { itemKey: null, amount: 0 };

    constructor(config: InteractiblesConfig) {
        super(config, 100, 'CRAFTER', true);
        registry.register(this);
        this.setOrigin(Crafter.displayOrigin.x, Crafter.displayOrigin.y);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 32)
        this.setDepth(config.position.y);

        this.stacks.push(this.#inputSlot);
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
            
            this.#currOutput = CRAFTING_RECIPES.get(this.#inputSlot.itemKey!);
            this.consumeItem(this.#inputSlot);
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
                this.consumeItem(this.#outputSlot);
                return;
            }
        }
    }

    private continueProcess(delta: number): void {
        
        this.#craftingProgress += delta;

        if (this.#craftingProgress >= Crafter.CRAFT_TIME) {

            if (this.isOutputEmpty()) {
                this.#outputSlot.itemKey = this.#currOutput!;
                this.#outputSlot.amount = 1;
            } else {
                this.#outputSlot.amount += 1;
            }
            this.#craftingProgress = 0;
        }
    }

    private isProcessing(): boolean {
        return this.#craftingProgress > 0;
    }

    private hasInputs(): boolean {
        return  this.#inputSlot.amount > 0
            && CRAFTING_RECIPES.has(this.#inputSlot.itemKey!);
    }

    private isOutputEmpty(): boolean {
        return this.#outputSlot.amount == 0;
    }

    private outputCanRecive(): boolean {
        return this.#outputSlot.amount < 64 
            && this.#inputSlot.itemKey !== null    
            && this.#outputSlot.itemKey === CRAFTING_RECIPES.get(this.#inputSlot.itemKey);
    }

    private routingStack(stack: StackData): StackData {
        if (!stack.itemKey) return stack;

        if (CRAFTING_RECIPES.has(stack.itemKey)) {
            return this.insertIntoSlot(0, stack);
        }

        return stack;
    }
}