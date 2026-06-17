import Phaser from 'phaser';
import en from './en.json';
import pt from './pt.json';
import fr from './fr.json';

type Translations = Record<string, string>;

const STORAGE_KEY = 'phasercorp_lang';

const LANGUAGES: Record<string, string> = {
  en: 'English',
  pt: 'Português',
  fr: 'Français',
};

const FLAGS: Record<string, string> = {
  en: '\u{1F1EC}\u{1F1E7}', // 🇬🇧
  pt: '\u{1F1F5}\u{1F1F9}', // 🇵🇹
  fr: '\u{1F1EB}\u{1F1F7}', // 🇫🇷
};

const ALL_TRANSLATIONS: Record<string, Translations> = { en, pt, fr };

class I18n {
  private currentLang: string = 'en';
  private translations: Translations = en;
  readonly emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) {
      this.currentLang = saved;
      this.translations = ALL_TRANSLATIONS[saved];
    }
  }

  get supportedLanguages(): Readonly<Record<string, string>> {
    return LANGUAGES;
  }

  get supportedFlags(): Readonly<Record<string, string>> {
    return FLAGS;
  }

  get currentLanguage(): string {
    return this.currentLang;
  }

  setLanguage(lang: string): void {
    if (!LANGUAGES[lang] || lang === this.currentLang) return;
    this.currentLang = lang;
    this.translations = ALL_TRANSLATIONS[lang];
    localStorage.setItem(STORAGE_KEY, lang);
    this.emitter.emit('languagechange', lang);
  }

  t(key: string): string {
    return this.translations[key] ?? key;
  }
}

export const i18n = new I18n();