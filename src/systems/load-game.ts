import { SaveManager } from './save-manager';
import type { Shop } from '../game-objects/shop';
import type { Player } from '../game-objects/player';
import type { Inventory } from '../components/game-object/inventory-component';
import type { MachineSaveState } from '../common/types';
import { Machine } from '../game-objects/machine';
import { PlacementSystem } from './placement-system';
import { Conveyer } from '../game-objects/machines/conveyer';

export function loadGame(shop: Shop, player: Player): void {
    const data = SaveManager.load();
    if (!data) return;
    shop.setPoints(data.shopPoints);
    player.setPosition(data.player.x, data.player.y);
}

export function loadInventory(inventory: Inventory): void {
    inventory.setSlotsData(SaveManager.getInventory());
}

export function restoreMachines(
    scene: Phaser.Scene,
    interactibles: Phaser.Physics.Arcade.StaticGroup,
    machines: Machine[],
    interactiblesMinusConveyors: Phaser.Physics.Arcade.StaticGroup,
    states: MachineSaveState[],
): void {
    for (const state of states) {
        const machine = PlacementSystem.create(scene, state.typeKey, { x: state.x, y: state.y }, state.facing);
        if (!machine) continue;
        machine.takeDamage(machine.health - state.health);
        for (let s = 0; s < state.stacks.length && s < machine.stacks.length; s++) {
            machine.stacks[s].itemKey = state.stacks[s].itemKey;
            machine.stacks[s].amount = state.stacks[s].amount;
        }
        interactibles.add(machine);
        machines.push(machine);
        if (!(machine instanceof Conveyer)) {
            interactiblesMinusConveyors.add(machine);
            machine.setDebugVisible(true);
        }
    }
}
