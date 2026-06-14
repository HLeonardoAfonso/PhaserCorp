import Phaser from 'phaser';
import type { Direction } from '../common/types';
import { DIRECTIONS } from '../common/const';
import { RotatableMachine } from '../game-objects/machines/rotatable-machine';
import { Interactibles, type InteractiblesConfig } from '../game-objects/interactibles';

type PlaceableConstructor = new(config: InteractiblesConfig) => Interactibles;

export class PlacementSystem {
    #scene: Phaser.Scene;
    #group: Phaser.Physics.Arcade.StaticGroup;
    #player: Phaser.Physics.Arcade.Sprite;
    #ghost: Phaser.GameObjects.Sprite | null = null;
    #active = false;
    #factory!: PlaceableConstructor;
    #animKey: string | null = null;
    #currentRotation = 0;
    #hasRotation = false;
    onPlacement?: (obj: Interactibles) => void;

    constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup, player: Phaser.Physics.Arcade.Sprite){
        this.#scene = scene;
        this.#group = group;
        this.#player = player;
    }

    get isActive() { return this.#active; }

    toggle(factory?: PlaceableConstructor, assetKey?: string): void {
        this.#active = !this.#active;
        if (this.#active && factory && assetKey){
            this.#factory = factory;
            // Check if the factory constructor extends RotatableMachine
            this.#hasRotation = RotatableMachine.prototype.isPrototypeOf(factory.prototype);
            this.#currentRotation = 0;
            this.#ghost = this.#scene.add.sprite(0,0, assetKey).setAlpha(0.5).setDepth(999);
            // Apply custom display origin if the factory defines one
            const origin = (this.#factory as unknown as { displayOrigin?: { x: number; y: number } }).displayOrigin;
            if (origin) this.#ghost.setOrigin(origin.x, origin.y);
            if (this.#animKey) this.#ghost.play(this.#animKey);
            this.#updateGhostRotation();
        } else {
            this.#ghost?.destroy();
            this.#active = false;
            this.#ghost = null;
        }
    }

    rotate(): void {
        if (!this.#active || !this.#hasRotation) return;
        this.#currentRotation = (this.#currentRotation + 1) % DIRECTIONS.length;
        this.#updateGhostRotation();
    }

    #updateGhostRotation(): void {
        if (!this.#ghost) return;
        this.#ghost.setAngle(DIRECTIONS[this.#currentRotation] === 'up' ? -90 :
                             DIRECTIONS[this.#currentRotation] === 'down' ? 90 :
                             DIRECTIONS[this.#currentRotation] === 'left' ? 180 : 0);
    }

    update(justClicked: boolean): void{
        if(!this.#active || !this.#ghost) return;

        const wp = this.#scene.cameras.main.getWorldPoint(this.#scene.input.activePointer.x, this.#scene.input.activePointer.y);
        const TILE = 64;
        const snappedX = Math.floor(wp.x / TILE) * TILE + TILE / 2;
        const snappedY = Math.floor(wp.y / TILE) * TILE + TILE / 2;
        this.#ghost.setPosition(snappedX, snappedY);

        const tileKey = (x: number, y: number) => `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;
        const key = tileKey(snappedX, snappedY);

        let canPlace = true;
        this.#group.getChildren().forEach(obj => {
            const sprite = obj as Phaser.GameObjects.Sprite;
            if (tileKey(sprite.x, sprite.y) === key) canPlace = false;
        });
        
        const playerBody = this.#player.body as Phaser.Physics.Arcade.Body;
        const playerRect = new Phaser.Geom.Rectangle(playerBody.x, playerBody.y, playerBody.width, playerBody.height);
        const tileRect = new Phaser.Geom.Rectangle(snappedX - TILE / 2, snappedY - TILE / 2, TILE, TILE);
        if (Phaser.Geom.Rectangle.Overlaps(tileRect, playerRect)) canPlace = false;

        this.#ghost.setTint(canPlace ? 0x00ff00 : 0xff0000);

        if (justClicked && canPlace){
            const facing = this.#hasRotation ? DIRECTIONS[this.#currentRotation] : undefined;
            const config: InteractiblesConfig & { facing?: Direction } = {
                scene: this.#scene,
                position: { x: snappedX, y: snappedY },
                facing,
            };
            const placedObj = new this.#factory(config);
            this.#group.add(placedObj);
            this.#scene.sound.play('PLACING_SOUND');
            this.onPlacement?.(placedObj);
            this.#ghost.destroy();
            this.#ghost = null;
            this.#active = false;
        }
    }
}