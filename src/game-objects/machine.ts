import { Interactibles, type InteractiblesConfig } from "./interactibles";
import type { StackData, Direction } from "../common/types";
import { registry } from "../systems/machine-registry";

export abstract class Machine extends Interactibles {

    #Interfacable: boolean;
    #stacks: StackData[] = [];
    
    constructor(config: InteractiblesConfig, health: number, assetKey: string, interfacable: boolean) {
        super(config, health, assetKey);
        this.#Interfacable = interfacable;
        registry.register(this);
    }

    get interfacable(): boolean {
        return this.#Interfacable;
    }

    /** Per-instance slot data. Mutated by the interface / process logic. */
    get stacks(): StackData[] {
        return this.#stacks;
    }

    /** Initialize the stack slots for this machine. Called by subclasses in their constructor. */
    protected setStackCount(count: number): void {
        this.#stacks = Array.from({ length: count }, () => ({ itemKey: null, amount: 0 }));
    }

    getStack(index: number): StackData | null {
        return this.#stacks[index] ?? null;
    }

    setStack(index: number, data: StackData): void {
        if (index < 0 || index >= this.#stacks.length) return;
        this.#stacks[index] = data;
    }

    playIdleAnimation(): void {}

    // autonomous machine item trasnfer system 

    //Accept an item from a neighbor. Returns true if accepted, false if rejected.
    // Exemplo
    // Conveyor calls neighbor.acceptItem({ itemKey: 'IRON_ORE', amount: 1 }).
    // The furnace accepts it into its smeltable slot and returns true.
    abstract acceptItem(stack: StackData): boolean;

    /**
     * Whether this machine can receive items from a given direction.
     * 
     * Example:
     *   conveyor.canReceiveFrom('left') returns true if its facing is not 'left'
     *   and its input slot is empty.
     */
    abstract canReceiveFrom(dir: Direction): boolean;

    /**
     * Called every game tick with delta in ms.
     * 
     * Example:
     *   A furnace accumulates delta in smeltingProgress.
     *   When smeltingProgress >= smeltingTime (100ms), it consumes fuel + ore
     *   and produces an output.
     */
    abstract update(delta: number): void;

    // ── Protected helpers ──────────────────────────────────────────

    /**
     * Attempt to insert a stack into a specific slot.
     * Returns the leftover stack that didn't fit.
     * 
     * Example:
     *   insertIntoSlot(0, { itemKey: 'COAL', amount: 5 })
     *   If slot 0 is empty, it accepts 5 coal (or up to 64) and returns leftover.
     *   If slot 0 already has COAL with amount 62, it accepts 2 and returns { itemKey: 'COAL', amount: 3 }.
     *   If slot 0 has IRON_ORE, it rejects all and returns the original stack.
     */
    protected insertIntoSlot(slotIndex: number, stack: StackData): StackData {
        const slot = this.#stacks[slotIndex];

        if (!slot) return stack;

        if (!slot.itemKey) {
            slot.itemKey = stack.itemKey;
            slot.amount  = Math.min(stack.amount, 64);
            const leftover = stack.amount - slot.amount;
            return { itemKey: leftover > 0 ? stack.itemKey : null, amount: leftover };
        }

        if (slot.itemKey === stack.itemKey && slot.amount < 64) {
            const space    = 64 - slot.amount;
            const accepted = Math.min(space, stack.amount);
            slot.amount   += accepted;
            const leftover = stack.amount - accepted;
            return { itemKey: leftover > 0 ? stack.itemKey : null, amount: leftover };
        }

        return stack; // slot occupied with different item
    }

    /**
     * Check death state and clean up if dead. Call from subclass update() if needed.
     * 
     * Example:
     *   update(delta) {
     *     this.checkDeath();
     *     if (this.isDead) return;
     *     // ... smelting logic
     *   }
     */
    protected checkDeath(): void {
        if (this.isDead) {
            Interactibles.clearSelected();
            Interactibles.clearHovered();
            Interactibles.onEntityDied?.(this.resourceKey);
            this.removeInteractive();
            this.destroy();
        }
    }

    // ── Lifecycle ──────────────────────────────────────────────────

    /**
     * Override destroy to unregister from the MachineRegistry.
     * 
     * Example:
     *   When a conveyor is mined, destroy() is called → it removes itself
     *   from the registry so getNeighbor() no longer finds it.
     */
    destroy(): void {
        registry.unregister(this);
        super.destroy();
    }
}