import { RotatableMachine } from "./rotatable-machine";
import type { RotatableConfig } from "./rotatable-machine";
import type { Recipe, Direction, StackData } from "../../common/types";
import { FUEL_ITEMS } from "./processes";
import { OPPOSITE } from "../../common/const";
import { registry } from "../../systems/machine-registry";

export class Drill extends RotatableMachine {

    static readonly craftRecipe: Recipe = [
        { itemKey: 'WOOD_ITEM', amount: 2, },
        { itemKey: 'COPPER_WIRE', amount: 2, }, 
        { itemKey: 'IRON_GEAR', amount: 2 }, 
    ];
    static readonly craftItemKey = 'DRILL';
    static readonly craftDisplayKey = 'DRILL';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly MINE_TIME = 500;

    get resourceKey(): string { return 'DRILL'; }

    #miningProcess = 0;
    #currOutput: string | undefined;

    #fuelSlot: StackData = { itemKey: null, amount: 0 };
    #outputSlot: StackData = { itemKey: null, amount: 0 };

    constructor(config: RotatableConfig) {
        super(config, 100, 'DRILL', true);
        this.setOrigin(Drill.displayOrigin.x, Drill.displayOrigin.y);
        this.setStackCount(1);
        this.setAngle(this.facing === 'up' ? -90 :
                      this.facing === 'down' ? 90 :
                      this.facing === 'left' ? 180 : 0);
        this.setBodySize(2*64, 64);
        this.body?.setOffset(64, 32)
        this.setDepth(config.position.y);

        this.stacks.push(this.#fuelSlot);
        this.stacks.push(this.#outputSlot);

        this.removeInteractive();
        const selection = new Phaser.Geom.Rectangle(64, 64, 2*64, 64);
        this.hitRect = selection;
        this.setInteractive(selection, Phaser.Geom.Rectangle.Contains);
    }

    update(delta: number): void {
        this.checkDeath();
        if (this.isDead) return;

        if (this.isProcessing()) {
            this.continueProcess(delta);
            
        } else if (this.hasFuel() && (this.isOutputEmpty() || this.outputCanRecive())) {
            
            //this.#currOutput = (this.#oreSlot.itemKey!);
            this.consumeItem(this.#fuelSlot);
            this.continueProcess(delta);
        }
        // this.#pushOutputToNeighbor();
    }

    private continueProcess(delta: number): void {
        
        this.#miningProcess += delta;

        if (this.#miningProcess >= Drill.MINE_TIME) {

            if (this.isOutputEmpty()) {
                this.#outputSlot.itemKey = this.#currOutput!;
                this.#outputSlot.amount = 1;
            } else {
                this.#outputSlot.amount += 1;
            }
            this.#miningProcess = 0;
        }
    }

    private isProcessing(): boolean {
        return this.#miningProcess > 0;
    }

    private hasFuel(): boolean {
        return  this.#fuelSlot.amount > 0;
    }

    private isOutputEmpty(): boolean {
        return this.#outputSlot.amount == 0;
    }

    private outputCanRecive(): boolean {
        return this.#outputSlot.amount < 64;
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

    private routingStack(stack: StackData): StackData {
        if (!stack.itemKey) return stack;

        // fuel - slot 0
        if (FUEL_ITEMS.includes(stack.itemKey)) {
            return this.insertIntoSlot(0, stack);
        }
        // Unknown item — reject
        return stack;
    }
}
