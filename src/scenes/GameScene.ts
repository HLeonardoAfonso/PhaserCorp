import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { Tree } from '../game-objects/tree';
import { Interactibles } from '../game-objects/interactibles';
import { Cursors } from '../common/cursor';
import { createAnimations } from '../construction/animations';
import { createWorld, WORLD, WATER_TILES } from '../construction/level';
import { Ore } from '../game-objects/ore';

export class GameScene extends Phaser.Scene {

  #player!: Player;
  #interactibles!: Phaser.Physics.Arcade.StaticGroup
  #controls!: KeyboardComponent

  constructor() {
    super({ key: 'GAME_SCENE' });
  }

  public create(): void {
    this.input.setDefaultCursor(Cursors.DEFAULT);

    const MAP_WIDTH = 2 * 16 * 64;
    const MAP_HEIGHT = 1 * 16 * 64;

    createAnimations(this);
    const MAP_DATA = createWorld(WORLD);

    //Build tilemap
    const map = this.make.tilemap({
      data: MAP_DATA,
      tileWidth: 64,
      tileHeight: 64,
    });
    const tileset = map.addTilesetImage('tileset', 'TILESET_COLOR1', 64, 64, 0, 0);
    if (!tileset) {
      console.warn('Failed to add tileset image');
      return;
    }
    const groundLayer = map.createLayer(0, tileset, 0, 0);
    if (groundLayer) {
      groundLayer.setDepth(1);
    }

    //Animated water foam behind water tiles
    const waterSet = new Set(WATER_TILES);
    for (let row = 0; row < MAP_DATA.length; row++) {
      for (let col = 0; col < MAP_DATA[row].length; col++) {
        if (waterSet.has(MAP_DATA[row][col])) {
          const foam = this.add.sprite(
            col * 64 + 32, 
            row * 64 + 32,
            'WATER_FOAM',
            0
          );
          foam.setDepth(0);
          foam.play('WATER_FOAM_ANIM');
        }
      }
    }

    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin not setup');
      return;
    }
    this.#controls = new KeyboardComponent(this.input.keyboard);

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.#player = new Player({
      scene: this,
      position: { x: (10*64)+32, y: (8*64)+32 },
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });

    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.#player);

    this.#player.setDepth(2);

    //Refresh do grupo interactibles através de um evento (desaparecer ore)
    this.#interactibles = this.physics.add.staticGroup();

    const tree = new Tree({ scene: this, position: { x: 100, y: 180 }, assetKey: 'TREE' });
    const ore = new Ore({ scene: this, position: { x: 200, y: 180 }, assetKey: 'ORE'});

    this.input.enableDebug(tree);
    this.input.enableDebug(ore);

    this.#interactibles.add(tree);
    this.#interactibles.add(ore);

    /**this.#interactibles.add(
      new Tree({
      scene: this,
      position: { x: (3*64)+32, y: (3*64)+32 },
      assetKey: 'TREE',
      })
    );
    this.#interactibles.add(
      new Tree({
      scene: this,
      position: { x: (6*64)+32, y: (3*64)+32 },
      assetKey: 'TREE',
      })
    );
    this.#interactibles.add(
      new Tree({
      scene: this,
      position: { x: (4*64)+32, y: (4*64)+32 },
      assetKey: 'TREE',
      })
    );
    */

    this.physics.add.collider(this.#player, this.#interactibles);
  }

  update() {
    this.physics.overlap(
      this.#player.getInteractZone(),
      this.#interactibles,
      (_, obj) => { //funcao lambda (zone, interactible:GameObject) (callback)
        const interact = obj as Interactibles //cast (interactible gameObject para Interactibles class) 
        if (!interact.isDead){
          this.#player.addNearInteractibles(interact)
        } 
      }
    );

    const hovered = Interactibles.currentHovered;
    if (hovered && !hovered.isDead) {
      const reachable = this.#player.nearInteractibles.has(hovered);
      this.input.setDefaultCursor(reachable ? Cursors.CLICKABLE : Cursors.UNREACHABLE);
    } else {
      this.input.setDefaultCursor(Cursors.DEFAULT);
    }

    this.#player.update();
  }
}