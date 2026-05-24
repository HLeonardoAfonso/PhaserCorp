import Phaser from 'phaser';
export class PreloadScene extends Phaser.Scene {

  constructor() {
    super({ key: 'PRELOAD_SCENE' });
  }

  public preload(): void {
    this.load.image('SEL_TL', 'assets/cursors/select_tl.png');
    this.load.image('SEL_TR', 'assets/cursors/select_tr.png');
    this.load.image('SEL_BL', 'assets/cursors/select_bl.png');
    this.load.image('SEL_BR', 'assets/cursors/select_br.png');

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

    this.load.spritesheet('FURNACE', 'assets/machines/Furnace.png', {
      frameWidth: 64,
      frameHeight: 128,
    });


    this.load.image('INVENTORY_BANNER', 'assets/Inventory/Banner.png');
    this.load.image('INVENTORY_TABLE', 'assets/Inventory/WoodTable.png');
    this.load.image('GOLD_ITEM', 'assets/Inventory/Gold_Resource.png');
    this.load.image('WOOD_ITEM', 'assets/Inventory/Wood_Resource.png');

    this.load.image('MACHINE_FURNACE', 'assets/machines/Furnace.png');
  }

  public create(): void {
    this.scene.start('GAME_SCENE');
  }
}
