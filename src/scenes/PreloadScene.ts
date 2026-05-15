export class PreloadScene extends Phaser.Scene {

  constructor() {
    super({ key: 'PRELOAD_SCENE' });
  }

  public preload(): void {
    this.load.pack('MAIN', 'assets/data/assets.json');
  }

  public create(): void {
    this.scene.start('GAME_SCENE');
  }

  #createAnimations(): void {
    this.anims.createFromAseprite('PLAYER');
  }
}