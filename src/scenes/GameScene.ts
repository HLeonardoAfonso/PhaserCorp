import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { Tree } from '../game-objects/tree';
import { Interactibles } from '../game-objects/interactibles';
import { Cursors } from '../common/cursor';

export class GameScene extends Phaser.Scene {

  #player!: Player;
  #trees!: Phaser.Physics.Arcade.StaticGroup
  #controls!: KeyboardComponent

  constructor() {
    super({ key: 'GAME_SCENE' });
  }

  preload() {
    this.load.spritesheet('PLAYER_IDLE', 'assets/pawn/Pawn_Idle.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('PLAYER_MOVE', 'assets/pawn/Pawn_Run.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('PLAYER_PICKAXE', 'assets/pawn/Pawn_Interact Pickaxe.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('PLAYER_AXE', 'assets/pawn/Pawn_Interact Axe.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('TREE', 'assets/tree/Tree.png', {
      frameWidth: 192,
      frameHeight: 192,
    })
  }

  public create(): void {
    this.input.setDefaultCursor(Cursors.DEFAULT);

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

    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#player = new Player({
      scene: this,
      position: {x: this.scale.width / 2, y: this.scale.height /2 },
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });
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
    this.physics.overlap(
      this.#player.getInteractZone(),
      this.#trees,
      (_, obj) => { //funcao lambda (zone, tree:GameObject) (callback)
        const tree = obj as Tree //cast (tree gameObject para Tree class) 
        if (!tree.isDead){
          this.#player.addNearInteractibles(tree)
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