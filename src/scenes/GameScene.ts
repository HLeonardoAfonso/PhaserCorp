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
    this.load.spritesheet('PLAYER', 'assets/pawn/Pawn_Idle.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
  }

  public create(): void {

    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin not setup');
      return;
    }

    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#player = new Player({
      scene: this,
      position: {x: this.scale.width / 2, y: this.scale.height /2 },
      assetKey: 'PLAYER',
      frame: 0,
      controls: this.#controls,
    });
  }

  update() {
    this.#player.update();
  }
}