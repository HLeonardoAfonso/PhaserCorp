import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // load assets here
  }

  create() {
    this.add.text(100, 100, 'Hello Phaser + Vite + TS!', {
      fontSize: '32px',
      color: '#ffffff',
    });
  }

  update() {
    // game loop logic
  }
}