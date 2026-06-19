import Phaser from 'phaser';
import { i18n } from '../locales/i18n';
import { SaveManager } from '../systems/save-manager';
import { BackGroundColor } from '../common/const'
import { DEPTH } from '../common/depth'

const TILE = 48;
const LANG_ICON_VERTICAL = 20;
const LANG_ICON_HORIZONTAL = 80;
const NEW_GAME_BTN = -90;
const LOAD_GAME_BTN = 50;

type FlagLayout = {
  startX: number;
  y: number;
  size: number;
  gap: number;
  langs: string[];
  flags: Record<string, string>;
};

export class MenuScene extends Phaser.Scene {

  #startText!: Phaser.GameObjects.Text;
  #loadText!: Phaser.GameObjects.Text;
  #flagTexts: Phaser.GameObjects.Text[] = [];
  #flagUnderlay: Phaser.GameObjects.Sprite[] = [];
  #langPickerOpen = false;

  constructor() {
    super({ key: 'MENU_SCENE' });
  }

  #addButton(y: number, key: string): [Phaser.GameObjects.Image, Phaser.GameObjects.Text] {
    const btn = this.add.image(this.cameras.main.width / 2, y, 'MENU_BUTTON');
    btn.setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    const text = this.add.text(this.cameras.main.width / 2, y, i18n.t(key), {
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    return [btn, text];
  }

  public create(): void {
    this.cameras.main.setBackgroundColor(BackGroundColor);

    const { width, height } = this.cameras.main;
    const banner = this.add.image(width / 2, height / 2, 'MENU_BANNER');
    banner.setOrigin(0.5);

    const btnNewGame = this.#addButton(height / 2 + NEW_GAME_BTN, 'menu.startNewGame');
    const btnLoadGame = this.#addButton(height / 2 + LOAD_GAME_BTN, 'menu.loadGame');

    const startButton = btnNewGame[0];
    const loadButton = btnLoadGame[0];

    this.#startText = btnNewGame[1];
    this.#loadText = btnLoadGame[1];

    startButton.on('pointerdown', () => { this.scene.start('GAME_SCENE') }); 
    loadButton.on('pointerdown', () => {
      if (SaveManager.hasSavedGame()) {
        this.scene.start('GAME_SCENE', { loadFromSave: true });
      }
    });

    // --- World icon (lower-left of banner) ---
    const iconX = banner.x - banner.displayWidth / 2 + LANG_ICON_HORIZONTAL;
    const iconY = banner.y + banner.displayHeight / 2 + LANG_ICON_VERTICAL;
    const worldIcon = this.add.image(iconX, iconY, 'MENU_WORLD_ICON')
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // --- Flags (hidden by default, toggled by world icon) ---
    const layout: FlagLayout = {
      langs: Object.keys(i18n.supportedLanguages),
      flags: { ...i18n.supportedFlags },
      size: 36,
      gap: 8,
      startX: iconX + 96,
      y: iconY,
    };

    this.#buildFlags(layout);
    this.#setFlagsVisible(false);

    worldIcon.on('pointerdown', () => {
      this.#langPickerOpen = !this.#langPickerOpen;
      this.#setFlagsVisible(this.#langPickerOpen);
    });

    // Rebuild button text on language change
    i18n.emitter.on('languagechange', () => {
      this.#startText.setText(i18n.t('menu.startNewGame'));
      this.#loadText.setText(i18n.t('menu.loadGame'));
      this.#rebuildFlags(layout);
    });

    this.events.once('shutdown', () => {
      i18n.emitter.off('languagechange');
    });
  }

  #buildFlags(layout: FlagLayout): void {
    const { startX, y, size, gap, langs, flags } = layout;

    // Underlay – paper frame behind the flags
    this.#buildUnderlay(layout);

    langs.forEach((lang, i) => {
      const x = startX + i * (size + gap);
      const flag = this.add.text(x, y, flags[lang], {
        fontSize: `${size}px`,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .setDepth(10006);

      if (lang === i18n.currentLanguage) {
        flag.setScale(1.15);
      }

      flag.on('pointerdown', () => {
        i18n.setLanguage(lang);
        this.#langPickerOpen = false;
        this.#setFlagsVisible(false);
      });

      this.#flagTexts.push(flag);
    });
  }

  #buildUnderlay(layout: FlagLayout): void {
    const { startX, y, size, gap, langs } = layout;

    // Bounding box of the flags (with padding)
    const firstFlagX = startX - size / 2 - 16;
    const lastFlagX  = startX + (langs.length - 1) * (size + gap) + size / 2 + 16;
    const underlayWidth = lastFlagX - firstFlagX;
    const columns = Math.max(1, Math.ceil(underlayWidth / TILE));
    const totalWidth = columns * TILE;
    const centerX = (firstFlagX + lastFlagX) / 2;
    const startUnderlayX = centerX - totalWidth / 2 + TILE / 2;

    // Row frames: [top row frames], [bottom row frames]
    const rowFrames: [number, number, number][] = [
      [0, 1, 2], // top: left, middle, right
      [6, 7, 8], // bottom: left, middle, right
    ];
    const rowSpacing = 64; // same as RecipeOverlay

    // Offset paper position relative to the flags
    const paperY = y - 32;

    rowFrames.forEach((frames, ri) => {
      for (let col = 0; col < columns; col++) {
        let frame: number;
        if (columns === 1) {
          frame = frames[1];          // single middle tile
        } else if (col === 0) {
          frame = frames[0];          // left edge
        } else if (col === columns - 1) {
          frame = frames[2];          // right edge
        } else {
          frame = frames[1];          // middle
        }

        const sprite = this.add.sprite(
          startUnderlayX + col * TILE,
          paperY + ri * rowSpacing,
          'PAPER',
          frame,
        )
          .setOrigin(0.5)
          .setDepth(DEPTH.MENU_PAPER);
        this.#flagUnderlay.push(sprite);
      }
    });
  }

  #rebuildFlags(layout: FlagLayout): void {
    this.#flagTexts.forEach(t => t.destroy());
    this.#flagTexts = [];
    this.#flagUnderlay.forEach(s => s.destroy());
    this.#flagUnderlay = [];
    this.#buildFlags(layout);
    this.#setFlagsVisible(this.#langPickerOpen);
  }

  #setFlagsVisible(visible: boolean): void {
    this.#flagTexts.forEach(t => t.setVisible(visible));
    this.#flagUnderlay.forEach(s => s.setVisible(visible));
  }
}