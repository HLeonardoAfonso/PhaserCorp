import Phaser from 'phaser';
export class PreloadScene extends Phaser.Scene {

  constructor() {
    super({ key: 'PRELOAD_SCENE' });
  }

  public preload(): void {
    this.load.spritesheet('PLAYER_IDLE', 'assets/pawn/Pawn_Idle.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('PLAYER_MOVE', 'assets/pawn/Pawn_Run.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('TILESET_COLOR1', 'assets/tileset/Tilemap_color1.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('WATER_FOAM', 'assets/tileset/Water Foam.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('TREE', 'assets/tree/Tree.png', {
      frameWidth: 192,
      frameHeight: 192,
    })
    this.load.spritesheet('PLAYER_PICKAXE', 'assets/pawn/Pawn_Interact Pickaxe.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('PLAYER_AXE', 'assets/pawn/Pawn_Interact Axe.png', {
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.spritesheet('ORE', 'assets/gold/Gold Stone 3_Highlight.png', {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  public create(): void {
    this.scene.start('GAME_SCENE');
  }
}
