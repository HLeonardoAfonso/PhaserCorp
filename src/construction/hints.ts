import { i18n } from '../locales/i18n';
import { DEPTH } from '../common/depth';

export class Hints {
  private demolishHint: Phaser.GameObjects.Text;
  private placementHint: Phaser.GameObjects.Text;
  private saveHint: Phaser.GameObjects.Text;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.demolishHint = this.createDemolishHint();
    this.placementHint = this.createPlacementHint();
    this.saveHint = this.createSaveHint();
  }

  private createDemolishHint(): Phaser.GameObjects.Text {
    return this.scene.add.text(
      20,
      this.scene.cameras.main.height - 60,
      i18n.t('game.demolish.hint'),
      { fontSize: '25px', color: '#ff8800', stroke: '#000000', strokeThickness: 2 },
    )
    .setOrigin(0, 1)
    .setScrollFactor(0)
    .setDepth(DEPTH.RIBBON_TEXT)
    .setVisible(false);
  }

  private createPlacementHint(): Phaser.GameObjects.Text {
    return this.scene.add.text(
      20,
      this.scene.cameras.main.height - 20,
      i18n.t('game.placement.cancelHint'),
      { fontSize: '25px', color: '#ff0000', stroke: '#000000', strokeThickness: 2 },
    )
    .setOrigin(0, 1)
    .setScrollFactor(0)
    .setDepth(DEPTH.RIBBON_TEXT)
    .setVisible(false);
  }

  private createSaveHint(): Phaser.GameObjects.Text {
    return this.scene.add.text(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2,
      i18n.t('game.save.hint'),
      { fontSize: '32px', color: '#00ff00', stroke: '#000000', strokeThickness: 3 },
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setDepth(DEPTH.RIBBON_TEXT)
    .setVisible(false);
  }

  showDemolishHint(visible: boolean): void {
    this.demolishHint.setVisible(visible);
  }

  showPlacementHint(visible: boolean): void {
    this.placementHint.setVisible(visible);
  }

  showSaveHint(visible: boolean): void {
    this.saveHint.setVisible(visible);
  }
}