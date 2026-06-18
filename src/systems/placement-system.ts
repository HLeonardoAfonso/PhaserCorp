import Phaser from 'phaser';
import type { Direction } from '../common/types';
import { DIRECTIONS } from '../common/const';
import { RotatableMachine } from '../game-objects/machines/rotatable-machine';
import { Interactibles, type InteractiblesConfig } from '../game-objects/interactibles';
import { Furnace } from '../game-objects/machines/furnace';
import { Conveyer } from '../game-objects/machines/conveyer';
import { Drill } from '../game-objects/machines/drill';
import { Crafter } from '../game-objects/machines/crafter';

const TILE = 64;
const GHOST_ALPHA = 0.5;
const GHOST_DEPTH = 999;
const VALID_TINT = 0x00ff00;
const INVALID_TINT = 0xff0000;

/** Constructor for a placeable object plus the optional static metadata
 *  the placement system reads off the class. */
type PlaceableConstructor = (new (config: InteractiblesConfig) => Interactibles) & {
    displayOrigin?: { x: number; y: number };
    rotationSteps?: number;
};

export interface PlaceableDef {
    factory: PlaceableConstructor;
    assetKey: string;
}

/** inventory itemKey (craftItemKey) -> how to place it */
const PLACEABLES: ReadonlyMap<string, PlaceableDef> = new Map(
    [Furnace, Conveyer, Drill, Crafter].map(cls => [
        cls.craftKey,
        { factory: cls as unknown as PlaceableConstructor, assetKey: cls.craftKey },
    ])
);

export class PlacementSystem {
    #scene: Phaser.Scene;
    #group: Phaser.Physics.Arcade.StaticGroup;
    #player: Phaser.Physics.Arcade.Sprite;
    #ghost: Phaser.GameObjects.Sprite | null = null;
    #active = false;
    #armed = false;
    #factory!: PlaceableConstructor;
    #itemKey: string | null = null;
    #currentRotation = 0;
    #hasRotation = false;

    onPlacement?: (obj: Interactibles) => void;
    onConsume?: (itemKey: string) => number;
    isTileBlocked?: (tileX: number, tileY: number) => boolean;

    constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup, player: Phaser.Physics.Arcade.Sprite) {
        this.#scene = scene;
        this.#group = group;
        this.#player = player;
    }

    static placeableFor(itemKey: string): PlaceableDef | undefined { return PLACEABLES.get(itemKey); }
    static isPlaceable(itemKey: string): boolean { return PLACEABLES.has(itemKey); }

    get isActive(): boolean { return this.#active; }

    /** Begin placing an inventory item; returns false if it isn't placeable. */
    startByItem(itemKey: string): boolean {
        const def = PlacementSystem.placeableFor(itemKey);
        if (!def) return false;
        this.start(def.factory, def.assetKey);
        this.#itemKey = itemKey;
        return true;
    }

    /** Begin placement with an explicit factory + ghost asset. */
    start(factory: PlaceableConstructor, assetKey: string): void {
        if (this.#active) this.cancel();

        this.#active = true;
        this.#armed = false;
        this.#factory = factory;
        this.#hasRotation = factory.prototype instanceof RotatableMachine;
        this.#currentRotation = 0;

        this.#ghost = this.#scene.add.sprite(0, 0, assetKey)
            .setAlpha(GHOST_ALPHA)
            .setDepth(GHOST_DEPTH);
        if (factory.displayOrigin) this.#ghost.setOrigin(factory.displayOrigin.x, factory.displayOrigin.y);
        this.#updateGhostRotation();
    }

    /** Abort placement and clear the ghost. */
    cancel(): void {
        this.#ghost?.destroy();
        this.#ghost = null;
        this.#active = false;
        this.#armed = false;
        this.#itemKey = null;
    }

    rotate(): void {
        if (!this.#active || !this.#hasRotation) return;
        const steps = this.#factory.rotationSteps ?? 4;
        this.#currentRotation = (this.#currentRotation + 1) % steps;
        this.#updateGhostRotation();
    }

    update(justClicked: boolean): void {
        if (!this.#active || !this.#ghost) return;

        // Arm only after the starting click is released, so that click can't
        // immediately place a machine.
        if (!this.#scene.input.activePointer.isDown) this.#armed = true;

        const { x, y } = this.#snappedPointer();
        this.#ghost.setPosition(x, y);

        const canPlace = this.#canPlaceAt(x, y);
        this.#ghost.setTint(canPlace ? VALID_TINT : INVALID_TINT);

        if (justClicked && canPlace && this.#armed) this.#place(x, y);
    }

    #updateGhostRotation(): void {
        if (!this.#ghost) return;
        const steps = this.#factory.rotationSteps ?? 4;
        if (steps === 2) {
            this.#ghost.setFlipX(this.#currentRotation === 1);
            return;
        }
        const facing = DIRECTIONS[this.#currentRotation];
        this.#ghost.setAngle(facing === 'up' ? -90 : facing === 'down' ? 90 : facing === 'left' ? 180 : 0);
    }

    /** World-space pointer position snapped to the tile-grid centre. */
    #snappedPointer(): { x: number; y: number } {
        const wp = this.#scene.cameras.main.getWorldPoint(
            this.#scene.input.activePointer.x,
            this.#scene.input.activePointer.y,
        );
        return {
            x: Math.floor(wp.x / TILE) * TILE + TILE / 2,
            y: Math.floor(wp.y / TILE) * TILE + TILE / 2,
        };
    }

    /** Verificação do placement da máquina */
    #canPlaceAt(x: number, y: number): boolean {
        const tileX = Math.floor(x / TILE);
        const tileY = Math.floor(y / TILE);
        
        //Impedir colocar em terreno como agua ou montanha
        if (this.isTileBlocked?.(tileX, tileY)) return false;

        //Impedir colocar em recursos como arvores ou minerios
        const occupied = this.#group.getChildren().some(obj => {
            const sprite = obj as Phaser.GameObjects.Sprite;
            return Math.floor(sprite.x / TILE) === tileX && Math.floor(sprite.y / TILE) === tileY;
        });
        if (occupied) return false;

        //Impedir de colocar dentro do player
        const body = this.#player.body as Phaser.Physics.Arcade.Body;
        const playerRect = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
        const tileRect = new Phaser.Geom.Rectangle(x - TILE / 2, y - TILE / 2, TILE, TILE);
        return !Phaser.Geom.Rectangle.Overlaps(tileRect, playerRect);
    }

    /** Build the object, register it, play sfx, then consume one from stock. */
    #place(x: number, y: number): void {
        const facing = this.#hasRotation ? DIRECTIONS[this.#currentRotation] : undefined;
        const config: InteractiblesConfig & { facing?: Direction } = {
            scene: this.#scene,
            position: { x, y },
            facing,
        };

        const placedObj = new this.#factory(config);
        this.#group.add(placedObj);
        this.#scene.sound.play('PLACING_SOUND');
        this.onPlacement?.(placedObj);

        if (this.#itemKey) {
            const remaining = this.onConsume?.(this.#itemKey) ?? 0;
            if (remaining <= 0) this.cancel();
        }
    }
}
