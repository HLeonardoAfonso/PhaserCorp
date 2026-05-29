import Phaser from 'phaser';
import { Interactibles, type InteractiblesConfig } from '../game-objects/interactibles';

type PlaceableConstructor = new(config: InteractiblesConfig) => Interactibles;

export class PlacementSystem {
    #scene: Phaser.Scene;
    #group: Phaser.Physics.Arcade.StaticGroup;
    #ghost: Phaser.GameObjects.Sprite | null = null;
    #active = false;
    #factory!: PlaceableConstructor;
    #assetKey!: string;
    #animKey: string | null = null;
    #debugGraphic!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup){
        this.#scene = scene;
        this.#group = group;
        this.#debugGraphic = scene.add.graphics().setDepth(1000);
    }

    get isActive() { return this.#active; }

    toggle(factory?: PlaceableConstructor, assetKey?: string): void {
        this.#active = !this.#active;
        if (this.#active && factory && assetKey){
            this.#factory = factory;
            this.#assetKey = assetKey;
            this.#ghost = this.#scene.add.sprite(0,0, assetKey).setAlpha(0.5).setDepth(999);
            if (this.#animKey)this.#ghost.play(this.#animKey)  
        } else {
            this.#debugGraphic.clear();
            this.#ghost?.destroy();
            this.#active = false;
            this.#ghost = null;
        }
    }

    update(justClicked: boolean): void{
        if(!this.#active || !this.#ghost) return;

        const wp = this.#scene.cameras.main.getWorldPoint(this.#scene.input.activePointer.x, this.#scene.input.activePointer.y);
        const TILE = 64;
        const snappedX = Math.floor(wp.x / TILE) * TILE + TILE / 2;
        const snappedY = Math.floor(wp.y / TILE) * TILE;
        this.#ghost.setPosition(snappedX, snappedY);

        const tileKey = (x: number, y: number) => `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;
        const key = tileKey(snappedX, snappedY);

        let canPlace = true;
        this.#group.getChildren().forEach(obj => {
            const sprite = obj as Phaser.GameObjects.Sprite;
            if (tileKey(sprite.x, sprite.y) === key) canPlace = false;
        });

        this.#ghost.setTint(canPlace ? 0x00ff00 : 0xff0000);

        if (justClicked && canPlace){
            const placedObj = new this.#factory({ scene: this.#scene, position: { x: snappedX, y: snappedY }, assetKey: this.#assetKey });
            this.#group.add(placedObj);
            this.#ghost.destroy();
            this.#ghost = null;
            this.#active = false;
        }
    }
}