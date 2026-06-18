import { RotatableMachine } from "./rotatable-machine";
import type { RotatableConfig } from "./rotatable-machine";
import type { Recipe, Direction, StackData } from "../../common/types";
import { FUEL_ITEMS } from "./processes";
import { DIRECTIONS, OPPOSITE } from "../../common/const";
import { registry } from "../../systems/machine-registry";
import { oreRegistry } from "../../systems/ore-registry";
import { Ore } from "../ore";

export class Drill extends RotatableMachine {

    static readonly rotationSteps = 2;

    static readonly craftRecipe: Recipe = [
        { itemKey: 'IRON_GEAR', amount: 3, },
        { itemKey: 'IRON_PLATE', amount: 5, }, 
        { itemKey: 'WOOD_ITEM', amount: 5 }, 
    ];
    static readonly craftKey = 'DRILL';
    static readonly displayOrigin = { x: 0.5, y: 0.75 };

    static readonly MINE_TIME = 1000;

    get resourceKey(): string { return 'DRILL'; }

    #scene!: Phaser.Scene;
    #miningProcess = 0;
    #currOutput: string | undefined;

    #fuelSlot: StackData = { itemKey: null, amount: 0 };
    #outputSlot: StackData = { itemKey: null, amount: 0 };
    #footprintTiles: number[];
    #oreTile: number;

    constructor(config: RotatableConfig) {
        super(config, 100, 'DRILL', true);
        this.setOrigin(Drill.displayOrigin.x, Drill.displayOrigin.y);
        this.setFlipX(this.facing === 'down');
        this.setBodySize(2*64, 64);
        this.setDepth(config.position.y);

        this.#scene = config.scene;
        this.stacks.push(this.#fuelSlot);
        this.stacks.push(this.#outputSlot);

        if (this.facing === 'down') {
            this.#footprintTiles = [this.x, this.x - 64];
            this.#oreTile = this.x + 64;
            this.body?.setOffset(0, 32)
        } else {
            this.#footprintTiles = [this.x, this.x + 64];
            this.#oreTile = this.x - 64;
            this.body?.setOffset(64, 32)
        }

        this.removeInteractive();
        const x = this.facing === 'down' ? 0 : 64;
        const selection = new Phaser.Geom.Rectangle(x, 64, 2*64, 64);
        this.hitRect = selection;
        this.setInteractive(selection, Phaser.Geom.Rectangle.Contains);

        // Register both tiles of the 2×1 footprint in MachineRegistry
        for (const tileX of this.#footprintTiles) {
            registry.registerAt(this, tileX, this.y);
            if (this.#scene.physics.world.drawDebug){
                this.#scene.add.rectangle(tileX, this.y, 64, 64, 0x00ff00, 0.3).setDepth(9999);
            }
        }

        // Check for neighboring ore and set output
        if (this.checkOre()) {
            this.#currOutput = this.#getKey();
        }
    }

    update(delta: number): void {
        this.checkDeath();
        if (this.isDead) return;

        if (this.isProcessing()) {
            this.continueProcess(delta);
            
        } else if (this.hasFuel() && this.checkOre() && (this.isOutputEmpty() || this.outputCanRecive())) {
            
            this.consumeItem(this.#fuelSlot);
            this.continueProcess(delta);
        }
        this.#pushOutputToNeighbor();
    }

    private continueProcess(delta: number): void {
        
        this.#miningProcess += delta;

        if (this.#miningProcess >= Drill.MINE_TIME) {

            if (this.isOutputEmpty()) {
                this.#outputSlot.itemKey = this.#currOutput!;
                this.#outputSlot.amount = 4;
            } else {
                this.#outputSlot.amount += 4;
            }
            this.#miningProcess = 0;
        }
    }

    private checkOre(): boolean {
        return !!this.getOreFromRegistry();;
    }

    #getKey(): string | undefined {
        return this.getOreFromRegistry().resourceKey;
    }

    private getOreFromRegistry(): Ore {
        return oreRegistry.getAt(Math.floor(this.#oreTile / 64), Math.floor(this.y / 64))!;
    }

    #pushOutputToNeighbor(): void {
        if (this.#outputSlot.itemKey === null) return;

        // Check from both footprint tiles
        for (const tileX of this.#footprintTiles) {
            for (const dir of DIRECTIONS) {
                const off = { x: dir === 'left' ? -64 : dir === 'right' ? 64 : 0, y: dir === 'up' ? -64 : dir === 'down' ? 64 : 0 };
                const neighbor = registry.get(tileX + off.x, this.y + off.y);
                if (!neighbor || neighbor === this) continue;
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