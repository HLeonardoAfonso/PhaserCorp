import Phaser from 'phaser';
import type { PlacementSystem } from './placement-system';
import { Furnace } from '../game-objects/machines/furnace';
import { Conveyer } from '../game-objects/machines/conveyer';
import { Drill } from '../game-objects/machines/drill';
import { Crafter } from '../game-objects/machines/crafter';
import { Crate } from '../game-objects/machines/crate';

export class DebugPlacement {
    #placement: PlacementSystem;
    #pKey: Phaser.Input.Keyboard.Key;
    #oKey: Phaser.Input.Keyboard.Key;
    #iKey: Phaser.Input.Keyboard.Key;
    #lKey: Phaser.Input.Keyboard.Key;
    #kKey: Phaser.Input.Keyboard.Key;

    constructor(placement: PlacementSystem, keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
        this.#placement = placement;
        this.#pKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.#oKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.#iKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.#lKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.#kKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    }

    /** Call once per frame from GameScene.update(). */
    handleInput(): void {
        // P > Furnace
        if (Phaser.Input.Keyboard.JustDown(this.#pKey)) {
            this.#togglePlacement(Furnace, Furnace.craftKey);
        }
        // O > Conveyer
        if (Phaser.Input.Keyboard.JustDown(this.#oKey)) {
            this.#togglePlacement(Conveyer, Conveyer.craftKey);
        }
        // I > Drill
        if (Phaser.Input.Keyboard.JustDown(this.#iKey)) {
            this.#togglePlacement(Drill, Drill.craftKey);
        }
        // L > Crafter
        if (Phaser.Input.Keyboard.JustDown(this.#lKey)) {
            this.#togglePlacement(Crafter, Crafter.craftKey);
        }
        // K > Crate
        if (Phaser.Input.Keyboard.JustDown(this.#kKey)) {
            this.#togglePlacement(Crate, Crate.craftKey);
        }
    }

    /** Toggle placement for a machine on/off. */
    #togglePlacement(factory: typeof Furnace | typeof Conveyer | typeof Drill | typeof Crafter | typeof Crate, assetKey: string): void {
        if (this.#placement.isActive) {
            this.#placement.cancel();
        } else {
            this.#placement.start(factory as any, assetKey);
        }
    }
}