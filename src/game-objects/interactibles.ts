import type { Position } from "../common/types";

export type InteractiblesConfig = {
    scene: Phaser.Scene;
    position: Position;
    frame?: number;
}

export abstract class Interactibles extends Phaser.Physics.Arcade.Sprite {
    
    static #currentHovered: Interactibles | null = null;
    static get currentHovered() { return Interactibles.#currentHovered; }
    static clearHovered() { Interactibles.#currentHovered = null; }
    
    static #currentSelected: Interactibles | null = null;
    static get currentSelected() { return Interactibles.#currentSelected; }
    static clearSelected() { Interactibles.#currentSelected = null; }
    static setSelected(interactible: Interactibles) { 
        Interactibles.#currentSelected = interactible; 
    }

    static onEntityDied: ((resourceKey: string) => void) | null = null;
    
    #health: number;
    #hovered = false;
    #hitRect!: Phaser.Geom.Rectangle;

    abstract get resourceKey(): string;

    constructor(config: InteractiblesConfig, health: number, assetKey: string) {
        const { scene, position, frame } = config;
        super(scene, position.x, position.y, assetKey, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, true); //Para ter collider
        this.#health = health;
        this.setInteractive();
        this.on('pointerover', () => {
            this.#hovered = true;
            Interactibles.#currentHovered = this;
        });
        this.on('pointerout', () => {
            this.#hovered = false;
            Interactibles.#currentHovered = null;
        });
    }

    get isHovered() { return this.#hovered; }
    get health() { return this.#health; }
    get isDead() { return this.#health <= 0; }
    get hitRect() { return this.#hitRect; }
    protected set hitRect(rect: Phaser.Geom.Rectangle) { this.#hitRect = rect; }

    takeDamage(amount: number): void {
        this.#health -= amount;
    }

    abstract playIdleAnimation(): void;
}