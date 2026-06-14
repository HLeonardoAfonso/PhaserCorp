import Phaser from 'phaser';
import { DEPTH } from '../../common/depth';

export class MachineInterface {
  
  protected scene: Phaser.Scene;
  protected table: Phaser.GameObjects.Image;
  protected machineImage: Phaser.GameObjects.Image | null = null;

  constructor(scene: Phaser.Scene, tableTexture = 'MACHINE_TABLE') {
    this.scene = scene;

    this.table = scene.add.image(
      (scene.cameras.main.centerX)+200,
      scene.cameras.main.centerY,
      tableTexture
    )
      .setScrollFactor(0)
      .setDepth(DEPTH.TABLE_BG)
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
      .setDepth(DEPTH.SLOT_IMAGE)
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
