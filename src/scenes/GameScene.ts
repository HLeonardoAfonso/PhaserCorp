import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';

export class GameScene extends Phaser.Scene {

  #player!: Player;
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
    this.load.spritesheet('PLAYER_ACT', 'assets/pawn/Pawn_Interact Pickaxe.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
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
      key: 'ACT',
      frames: this.anims.generateFrameNumbers('PLAYER_ACT', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#player = new Player({
      scene: this,
      position: {x: this.scale.width / 2, y: this.scale.height /2 },
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });
  }

  update() {
    this.#player.update();
  }
}