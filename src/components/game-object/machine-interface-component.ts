import Phaser from 'phaser';

export class MachineInterface {
  
  protected scene: Phaser.Scene;
  protected table: Phaser.GameObjects.Image;
  protected machineImage: Phaser.GameObjects.Image | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.table = scene.add.image(
      (scene.cameras.main.centerX)+200,
      scene.cameras.main.centerY,
      'MACHINE_TABLE'
    )
      .setScrollFactor(0)
      .setDepth(1000)
      .setVisible(false);
  }

  get isOpen(): boolean {
    return this.table.visible;
  }

  open(textureKey: string): void {
    // Destroy any existing machine image
    this.machineImage?.destroy();

    // Create new machine image centered on the table
    this.machineImage = this.scene.add.image(this.table.x, this.table.y, textureKey)
      .setScrollFactor(0)
      .setDepth(1002)
      .setVisible(true);

    // Open the interface via toggleDisplay
    this.toggleDisplay(true);
  }

  toggleDisplay(bool: boolean): void {
    this.table.setVisible(bool);
    this.machineImage?.setVisible(bool);
  }

  toggle(): void {
    const visible = !this.table.visible;
    this.toggleDisplay(visible);
  }

  close(): void {
    this.toggleDisplay(false);
  }
}
