import { RotatableMachine } from "./rotatable-machine";
import type { RotatableConfig } from "./rotatable-machine";
import type { Recipe, Direction, StackData } from "../../common/types";
import { OPPOSITE } from "../../common/const";
import { registry } from "../../systems/machine-registry";

export class Conveyer extends RotatableMachine {

    static readonly craftRecipe: Recipe = [
        { itemKey: 'WOOD_ITEM', amount: 2, },
        { itemKey: 'COPPER_WIRE', amount: 2, }, 
        { itemKey: 'IRON_GEAR', amount: 2 }, 
    ];
    static readonly craftItemKey = 'MACHINE_CONVEYOR';
    static readonly craftDisplayKey = 'CONVEYOR';

    static readonly INPUT  = 0;
    static readonly INNER  = 1;
    static readonly OUTPUT = 2;

    static readonly TICK_INTERVAL = 500;

    get resourceKey(): string { return 'MACHINE_CONVEYOR'; }

    #tickAccumulator = 0;

    constructor(config: RotatableConfig) {
        super(config, 100, 'CONVEYOR', false);
        this.setStackCount(3);
        this.setAngle(this.facing === 'up' ? -90 :
                      this.facing === 'down' ? 90 :
                      this.facing === 'left' ? 180 : 0);
        this.setBodySize(64, 64);
        this.body?.setOffset(0, 0)
        this.setDepth(config.position.y);

        this.removeInteractive();
        const rect = new Phaser.Geom.Rectangle(0, 0, 64, 64);
        this.hitRect = rect;
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
    }

    update(delta: number): void {
        this.checkDeath();
        if (this.isDead) return;

        this.#tickAccumulator += delta;

        while (this.#tickAccumulator >= Conveyer.TICK_INTERVAL) {
            this.#tickAccumulator -= Conveyer.TICK_INTERVAL;

            // 1: push OUTPUT → neighbor
            this.#pushToNeighbor(this.facing);

            // 2: push INNER → OUTPUT
            this.#moveStack(Conveyer.INNER, Conveyer.OUTPUT);

            // 3: push INPUT → INNER
            this.#moveStack(Conveyer.INPUT, Conveyer.INNER);
        }
    }

    #pushToNeighbor(dir: Direction): void {

        const neighbor = registry.getNeighbor(this, dir);

        if (!neighbor) return;
        if (!neighbor.canReceiveFrom(OPPOSITE[dir])) return;

        const stack: StackData = { 
            itemKey: this.stacks[Conveyer.OUTPUT].itemKey, 
            amount: this.stacks[Conveyer.OUTPUT].amount 
        };
        if (neighbor.acceptItem(stack)) this.clearStack(this.stacks[Conveyer.OUTPUT]);
    }

    #moveStack(from: number, to: number): void {

        if (this.isSlotEmpty(to)){
            this.stacks[to].itemKey = this.stacks[from].itemKey;
            this.stacks[to].amount  = this.stacks[from].amount;
            this.clearStack(this.stacks[from]);
        }
    }

    clearStack(stack: StackData): void {
        stack.itemKey = null;
        stack.amount  = 0;
    }

    acceptItem(stack: StackData): boolean {
        if (stack.amount !== 1) return false;
        if (!this.isSlotEmpty(Conveyer.INPUT)) return false;

        this.stacks[Conveyer.INPUT].itemKey = stack.itemKey;
        this.stacks[Conveyer.INPUT].amount = 1;
        return true;
    }

    canReceiveFrom(dir: Direction): boolean {
        return dir !== this.facing && this.isSlotEmpty(Conveyer.INPUT);
    }

    private isSlotEmpty(slotIndex: number): boolean {
        return this.stacks[slotIndex].itemKey === null;
    }

    static get placementRect(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(-32, 64 + 5, 64, 54);
    }
}