import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    width: 22 * 64,
    height: 12 * 64,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#47ABA9',
  scene: [PreloadScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};

new Phaser.Game(config);