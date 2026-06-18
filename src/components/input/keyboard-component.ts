import { InputComponent } from "./input-components";

export class KeyboardComponent extends InputComponent {
    #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    #enterKey: Phaser.Input.Keyboard.Key;
    #wKey: Phaser.Input.Keyboard.Key;
    #aKey: Phaser.Input.Keyboard.Key;
    #sKey: Phaser.Input.Keyboard.Key;
    #dKey: Phaser.Input.Keyboard.Key;
    #eKey: Phaser.Input.Keyboard.Key;
    #xKey: Phaser.Input.Keyboard.Key;
    #rKey: Phaser.Input.Keyboard.Key;
    #zKey: Phaser.Input.Keyboard.Key;

    constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
        super();
        this.#cursorKeys = keyboardPlugin.createCursorKeys();
        this.#enterKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.#wKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.#aKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.#sKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.#dKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.#eKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.#rKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.#xKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.#zKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    get isUpDown(): boolean { return this.#cursorKeys.up.isDown || this.#wKey.isDown; }
    get isDownDown(): boolean { return this.#cursorKeys.down.isDown || this.#sKey.isDown;}
    get isLeftDown(): boolean { return this.#cursorKeys.left.isDown || this.#aKey.isDown }
    get isRightDown(): boolean { return this.#cursorKeys.right.isDown || this.#dKey.isDown; }

    get isDownJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.down); }
    get isUpJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up); }  
    get isSelectKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift); }
    get isEnterKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#enterKey); }

    get isEKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#eKey); }
    get isRKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#rKey); }
    get isXKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#xKey); }
    get isZKeyJustDown(): boolean { return Phaser.Input.Keyboard.JustDown(this.#zKey); }
}
