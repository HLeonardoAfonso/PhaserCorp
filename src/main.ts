import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#47ABA9',
  scene: [PreloadScene, MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};

new Phaser.Game(config);