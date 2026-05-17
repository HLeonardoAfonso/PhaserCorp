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
    this.load.spritesheet('PLAYER_ACT', 'assets/pawn/Pawn_Interact Pickaxe.png', {
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
  }

  public create(): void {
    this.scene.start('GAME_SCENE');
  }
}
