import { i18n } from '../locales/i18n';
import { DEPTH } from '../common/depth';

export function createHints(scene: Phaser.Scene): { demolishHint: Phaser.GameObjects.Text; placementHint: Phaser.GameObjects.Text } {
  const demolishHint = scene.add.text(
    20,
    scene.cameras.main.height - 60,
    i18n.t('game.demolish.hint'),
    { fontSize: '25px', color: '#ff8800', stroke: '#000000', strokeThickness: 2 },
  )
  .setOrigin(0, 1)
  .setScrollFactor(0)
  .setDepth(DEPTH.RIBBON_TEXT)
  .setVisible(false);

  const placementHint = scene.add.text(
    20,
    scene.cameras.main.height - 20,
    i18n.t('game.placement.cancelHint'),
    { fontSize: '25px', color: '#ff0000', stroke: '#000000', strokeThickness: 2 },
  )
  .setOrigin(0, 1)
  .setScrollFactor(0)
  .setDepth(DEPTH.RIBBON_TEXT)
  .setVisible(false);

  return { demolishHint, placementHint };
}
