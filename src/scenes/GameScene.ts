import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { Tree } from '../game-objects/tree';
import { Interactibles } from '../game-objects/interactibles';
import { Cursors } from '../common/cursor';
import { Inventory } from '../components/game-object/inventory-component';
import { createAnimations } from '../construction/animations';
import { createWorld, WATER_TILES } from '../construction/world-render';
import { WORLD } from '../construction/world';
import { Ore } from '../game-objects/ore';
import { Furnace } from '../game-objects/machines/furnace';
import { Conveyer } from '../game-objects/machines/conveyer';
import { ConveyerCurve } from '../game-objects/machines/conveyer-curve';
import { Crafting } from '../components/game-object/crafting-component';

export class GameScene extends Phaser.Scene {

  #player!: Player;
  #interactibles!: Phaser.Physics.Arcade.StaticGroup
  #controls!: KeyboardComponent
  #inventory!: Inventory;
  #crafting!: Crafting;
  #selectionCorners!: { tl: Phaser.GameObjects.Image, tr: Phaser.GameObjects.Image, bl: Phaser.GameObjects.Image, br: Phaser.GameObjects.Image };
  #wasPointerDown = false;

  constructor() {
    super({ key: 'GAME_SCENE' });
  }

  public create(): void {
    this.input.setDefaultCursor(Cursors.DEFAULT);
    this.#selectionCorners = {
      tl: this.add.image(0, 0, 'SEL_TL').setOrigin(0.5, 0.5).setDepth(999).setVisible(false),
      tr: this.add.image(0, 0, 'SEL_TR').setOrigin(0.5, 0.5).setDepth(999).setVisible(false),
      bl: this.add.image(0, 0, 'SEL_BL').setOrigin(0.5, 0.5).setDepth(999).setVisible(false),
      br: this.add.image(0, 0, 'SEL_BR').setOrigin(0.5, 0.5).setDepth(999).setVisible(false),
    };

    const MAP_WIDTH = 3 * 16 * 64;
    const MAP_HEIGHT = 3 * 16 * 64;

    createAnimations(this);
    const MAP_DATA = createWorld(WORLD);

    //Build tilemap
    const map = this.make.tilemap({
      data: MAP_DATA,
      tileWidth: 64,
      tileHeight: 64,
    });
    const tileset = map.addTilesetImage('tileset', 'TILESET_COLOR1', 64, 64, 0, 0);
    if (!tileset) {
      console.warn('Failed to add tileset image');
      return;
    }
    const groundLayer = map.createLayer(0, tileset, 0, 0);
    if (groundLayer) {
      groundLayer.setDepth(1);
    }

    const waterFoamSet = new Set(WATER_TILES);
    const waterColliders = this.physics.add.staticGroup();

    for (let row = 0; row < MAP_DATA.length; row++) {
      for (let col = 0; col < MAP_DATA[row].length; col++) {
        
        // water foam render
        if (waterFoamSet.has(MAP_DATA[row][col])) {
          const foam = this.add.sprite( col * 64 + 32, row * 64 + 32, 'WATER_FOAM', 0);
          foam.setDepth(0);
          foam.play('WATER_FOAM_ANIM');
        }
        // water collider
        if (MAP_DATA[row][col] === 4) {
        const waterZone = this.add.zone( col * 64 + 32, row * 64 + 32, 64, 64 );
        waterColliders.add(waterZone);
      }
      }
    }

    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin not setup');
      return;
    }
    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#inventory = new Inventory(this, this.#controls, this.physics.world.drawDebug);
    this.#crafting = new Crafting(this, this.#controls, this.physics.world.drawDebug);
    Interactibles.onEntityDied = (key) => this.#inventory.addItems(key, 32);

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.#player = new Player({
      scene: this,
      position: { x: (10*64)+32, y: (8*64)+32 },
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });

    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.#player);

    this.#player.setDepth(2);

    //Refresh do grupo interactibles através de um evento (desaparecer ore)
    this.#interactibles = this.physics.add.staticGroup();

    const tree = new Tree({ scene: this, position: { x: 100, y: 180 }, assetKey: 'TREE' });
    const tree1 = new Tree({ scene: this, position: { x: (3*64)+32, y: (3*64)+32 }, assetKey: 'TREE' });
    const tree2 = new Tree({ scene: this, position: { x: (6*64)+32, y: (3*64)+32 }, assetKey: 'TREE' });
    // const tree3 = new Tree({ scene: this, position: { x: (4*64)+32, y: (4*64)+32 }, assetKey: 'TREE' });
    const ore = new Ore({ scene: this, position: { x: 200, y: 180 }, assetKey: 'ORE'});
    const furnace = new Furnace({ scene: this, position: { x: 64*10, y: 600 }, assetKey: 'FURNACE'});
    const conveyer = new Conveyer({ scene: this, position: { x: (12*64)+32, y: (2*64)+32 }, assetKey: 'CONVEYOR'});
    const conveyerCurve = new ConveyerCurve({ scene: this, position: { x: (11*64)+32, y: (2*64)+32 }, assetKey: 'CONVEYOR_CURVE'});
    const furnace3 = new Furnace({ scene: this, position: { x: 64*13, y: 600 }, assetKey: 'FURNACE'});
    const furnace4 = new Furnace({ scene: this, position: { x: 64*14, y: 600 }, assetKey: 'FURNACE'});
    


    this.input.enableDebug(tree);
    this.input.enableDebug(tree1);
    this.input.enableDebug(tree2);
    this.input.enableDebug(furnace);
    this.input.enableDebug(ore);

    this.#interactibles.add(tree);
    this.#interactibles.add(tree1);
    this.#interactibles.add(tree2);
    this.#interactibles.add(furnace);
    this.#interactibles.add(ore);
    this.#interactibles.add(conveyer);

    this.physics.add.collider(this.#player, this.#interactibles);
    this.physics.add.collider(this.#player, waterColliders);
    this.input.on('gameobjectdown', (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      if (obj instanceof Interactibles && this.#player.nearInteractibles.has(obj)) {
          Interactibles.setSelected(obj);
      }
    });
  }

  update() {

    //Player zone interaction
    this.physics.overlap(
      this.#player.getInteractZone(),
      this.#interactibles,
      (_, obj) => { //funcao lambda (zone, interactible:GameObject) (callback)
        const interact = obj as Interactibles //cast (interactible gameObject para Interactibles class) 
        if (!interact.isDead){
          this.#player.addNearInteractibles(interact)
        } 
      }
    );
    
    if (!this.#inventory.isOpen) {
      //Click Interactibles
      const isDown = this.input.activePointer.isDown;
      const justClicked = isDown && !this.#wasPointerDown;
      this.#wasPointerDown = isDown;

      if (justClicked) {
      const hovered = Interactibles.currentHovered;
        if (hovered && !hovered.isDead && this.#player.nearInteractibles.has(hovered)) {
          Interactibles.setSelected(hovered);
        }
      }
      
      //Opaque Zone check for trees
      const body = this.#player.body as Phaser.Physics.Arcade.Body;
      const playerRect = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
      this.#interactibles.getChildren().forEach(obj => {
        if (!(obj instanceof Tree) || obj.isDead) return;
        const overlap = Phaser.Geom.Rectangle.Overlaps(
            playerRect,
            obj.opaqueZone.getBounds()
        );
        const behind = this.#player.y < obj.y;
        obj.setAlpha(overlap && behind ? 0.5 : 1);
      });

      //Mouse hover icons
      const hovered = Interactibles.currentHovered;
      if (hovered && !hovered.isDead) {
        const reachable = this.#player.nearInteractibles.has(hovered);
        this.input.setDefaultCursor(reachable ? Cursors.CLICKABLE : Cursors.UNREACHABLE);
      } else {
        this.input.setDefaultCursor(Cursors.DEFAULT);
      }

      //Select icons
      const selected = Interactibles.currentSelected;

      if (selected && !selected.isDead && selected.input) {
        const hit = selected.hitRect;
        const left = selected.x - selected.originX * selected.width  + hit.x;
        const top = selected.y - selected.originY * selected.height + hit.y;
        const right = left + hit.width;
        const bottom = top  + hit.height;

        this.#selectionCorners.tl.setPosition(left,  top).setVisible(true);
        this.#selectionCorners.tr.setPosition(right, top).setVisible(true);
        this.#selectionCorners.bl.setPosition(left,  bottom).setVisible(true);
        this.#selectionCorners.br.setPosition(right, bottom).setVisible(true);
      } else {
        Object.values(this.#selectionCorners).forEach(c => c.setVisible(false));
      }
    }

    this.#player.update();
    if (this.#controls.isEKeyJustDown) {
      this.#inventory.toggle();
      this.#crafting.toggle();
    }
  }
}
