import Phaser from 'phaser';
import { Interactibles, type InteractiblesConfig } from '../game-objects/interactibles';

type PlaceableConstructor = new(config: InteractiblesConfig) => Interactibles;

export class PlacementSystem {
    #scene: Phaser.Scene;
    #group: Phaser.Physics.Arcade.StaticGroup;
    #ghost: Phaser.GameObjects.Sprite | null = null;
    #active = false;
    #placementRect!: Phaser.Geom.Rectangle;
    #factory!: PlaceableConstructor;
    #assetKey!: string;
    #animKey: string | null = null;

    constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup){
        this.#scene = scene;
        this.#group = group;
    }

    get isActive() { return this.#active; }

    toggle(factory?: PlaceableConstructor, assetKey?: string, placementRect?: Phaser.Geom.Rectangle): void {
        this.#active = !this.#active;
        if (this.#active && factory && assetKey && placementRect){
            this.#factory = factory;
            this.#assetKey = assetKey;
            this.#placementRect = placementRect;
            this.#ghost = this.#scene.add.sprite(0,0, assetKey).setAlpha(0.5).setDepth(999);
            if (this.#animKey)this.#ghost.play(this.#animKey);  
        } else {
            this.#ghost?.destroy();
            this.#active = false;
            this.#ghost = null;
        }
    }

    update(justClicked: boolean): void{
        if(!this.#active || !this.#ghost) return;

        const wp = this.#scene.cameras.main.getWorldPoint(this.#scene.input.activePointer.x, this.#scene.input.activePointer.y);
        this.#ghost.setPosition(wp.x, wp.y);
        
        const ghostRect = new Phaser.Geom.Rectangle(
            wp.x + this.#placementRect.x,
            wp.y + this.#placementRect.y,
            this.#placementRect.width,
            this.#placementRect.height,
        );

        let canPlace:boolean = true;
        this.#group.getChildren().forEach(obj => {
            const body = (obj as Interactibles).body as Phaser.Physics.Arcade.StaticBody;
            if (Phaser.Geom.Rectangle.Overlaps(ghostRect, new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height))){
                canPlace = false;
            }
        });

        this.#ghost.setTint(canPlace ? 0x00ff00 : 0xff0000);

        if (justClicked && canPlace){
            const placedObj = new this.#factory({ scene: this.#scene, position: { x: wp.x, y: wp.y }, assetKey: this.#assetKey });
            this.#group.add(placedObj);
            this.#ghost.destroy();
            this.#ghost = null;
            this.#active = false
        }
    }
}