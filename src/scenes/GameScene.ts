import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import MAP_DATA, { WATER_TILES } from '../levels/level1';
import { Tree } from '../game-objects/tree';

export class GameScene extends Phaser.Scene {

  #player!: Player;
  #trees!: Phaser.Physics.Arcade.StaticGroup
  #controls!: KeyboardComponent

  constructor() {
    super({ key: 'GAME_SCENE' });
  }

  public create(): void {

    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin not setup');
      return;
    }

    this.anims.create({
      key: 'IDLE',
      frames: this.anims.generateFrameNumbers('PLAYER_IDLE', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'MOVE',
      frames: this.anims.generateFrameNumbers('PLAYER_MOVE', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'ACT_PICKAXE',
      frames: this.anims.generateFrameNumbers('PLAYER_PICKAXE', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'ACT_AXE',
      frames: this.anims.generateFrameNumbers('PLAYER_AXE', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    
    this.anims.create({
      key: 'TREE_IDLE',
      frames: this.anims.generateFrameNumbers('TREE', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'TREE_CHOP',
      frames: this.anims.generateFrameNumbers('TREE', { start: 4, end: 5 }),
      frameRate: 8,
      repeat: 0,
    });


    // ── Water animation ──
    this.anims.create({
      key: 'WATER_FOAM_ANIM',
      frames: this.anims.generateFrameNumbers('WATER_FOAM', { start: 0, end: 16 }),
      frameRate: 8,
      repeat: -1,
    });

    // ── Build tilemap ──
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

    // ── Animated water foam behind water tiles ──
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

    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#player = new Player({
      scene: this,
      position: {x: this.scale.width / 2, y: this.scale.height /2 },
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });

    this.#player.setDepth(2);
    this.#trees = this.physics.add.staticGroup();
    this.#trees.add(
      new Tree({
      scene: this,
      position: { x: 100, y: 100 },
      assetKey: 'TREE',
    })
    );
    this.physics.add.collider(this.#player, this.#trees);
  }

  update() {
    this.#player.nearInteractible = null;
    this.physics.overlap(
      this.#player.getInteractZone(),
      this.#trees,
      (_, tree) => { //funcao lambda (zone, tree) (callback)
        this.#player.nearInteractible = tree as Tree; //cast (tree gameObject para Tree class)
      }
    );
    this.#player.update();
  }
}