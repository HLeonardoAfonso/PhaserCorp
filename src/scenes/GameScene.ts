import Phaser from 'phaser';
import { Player } from '../game-objects/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { Interactibles } from '../game-objects/interactibles';
import { Tree } from '../game-objects/tree';
import { Cursors } from '../common/cursor';
import { Inventory } from '../components/game-object/inventory-component';
import { createAnimations } from '../construction/animations';
import { Hints } from '../construction/hints';
import { createWorld, createRockLayer, createWaterEffects, createRockColliders } from '../construction/world-render';
import { WORLD } from '../construction/world';
import { Conveyer } from '../game-objects/machines/conveyer';
import { spawnInteractibles, restoreEntityStates } from '../game-objects/spawn';
import { Shop } from '../game-objects/shop';
import { Crafting } from '../components/game-object/crafting-component';
import { FurnaceInterface } from '../components/game-object/furnace-interface-component';
import { Machine } from '../game-objects/machine';
import { PlacementSystem } from '../systems/placement-system';
import { DebugPlacement } from '../systems/debug-placement';
import { DEPTH } from '../common/depth';
import { Ribbon } from '../components/game-object/ribbon-component';
import { ShopInterface } from '../components/game-object/shop-interface-component';
import { PRICES } from '../game-objects/machines/processes';
import type { Ribbon as RibbonType } from '../components/game-object/ribbon-component';
import { TILES } from '../construction/tile-config';
import { Ore } from '../game-objects/ore';
import { loadGame, restoreMachines, loadInventory } from '../systems/load-game';
import { SaveManager } from '../systems/save-manager';
import type { StackData, Direction } from '../common/types';

const SHOP_POSITION = { x: (23 * 64) + 32, y: (23 * 64) + 32 };
const PLAYER_POSITION = { x: (22*64), y: (27*64) };
const TILE_SIZE = 64;
const CHUNK_SIZE = 16;

export class GameScene extends Phaser.Scene {

  #player!: Player;
  #interactibles!: Phaser.Physics.Arcade.StaticGroup
  #interactiblesMinusConveyors!: Phaser.Physics.Arcade.StaticGroup

  #controls!: KeyboardComponent

  #inventory!: Inventory;
  #crafting!: Crafting;
  #machineInterface!: FurnaceInterface;
  #shopInterface!: ShopInterface;
  #ribbon!: RibbonType;
  #selectionCorners!: { tl: Phaser.GameObjects.Image, tr: Phaser.GameObjects.Image, bl: Phaser.GameObjects.Image, br: Phaser.GameObjects.Image };
  #shop!: Shop;
  #wasPointerDown = false;
  #placement!: PlacementSystem;
  #machines: Machine[] = [];
  #hints!: Hints;
  #demolishMode = false;
  #debugPlacement!: DebugPlacement;
  constructor() {
    super({ key: 'GAME_SCENE' });
  }

  public create(): void {
    this.input.setDefaultCursor(Cursors.DEFAULT);
    this.#selectionCorners = {
      tl: this.add.image(0, 0, 'SEL_TL').setOrigin(0.5, 0.5).setDepth(DEPTH.SELECTION_CORNERS).setVisible(false),
      tr: this.add.image(0, 0, 'SEL_TR').setOrigin(0.5, 0.5).setDepth(DEPTH.SELECTION_CORNERS).setVisible(false),
      bl: this.add.image(0, 0, 'SEL_BL').setOrigin(0.5, 0.5).setDepth(DEPTH.SELECTION_CORNERS).setVisible(false),
      br: this.add.image(0, 0, 'SEL_BR').setOrigin(0.5, 0.5).setDepth(DEPTH.SELECTION_CORNERS).setVisible(false),
    };

    const MAP_WIDTH = WORLD.length * CHUNK_SIZE * TILE_SIZE;
    const MAP_HEIGHT = WORLD[0].length * CHUNK_SIZE * TILE_SIZE;

    createAnimations(this);
    const MAP_DATA = createWorld(WORLD);

    //Build tilemap
    const map = this.make.tilemap({
      data: MAP_DATA,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const tileset = map.addTilesetImage('tileset', 'TILESET_COLOR1', TILE_SIZE, TILE_SIZE, 0, 0);
    if (!tileset) {
      console.warn('Failed to add tileset image');
      return;
    }
    const groundLayer = map.createLayer(0, tileset, 0, 0);
    if (groundLayer) {
      groundLayer.setDepth(DEPTH.GROUND);
    }

    // Rock overlay layer at depth 2
    const rockData = createRockLayer(WORLD);
    const rockLayer = this.make.tilemap({
      data: rockData,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const rockTileset = rockLayer.addTilesetImage('tileset', 'TILESET_COLOR1', TILE_SIZE, TILE_SIZE, 0, 0);
    if (rockTileset) {
      const rockGroundLayer = rockLayer.createLayer(0, rockTileset, 0, 0);
      if (rockGroundLayer) {
        rockGroundLayer.setDepth(DEPTH.ROCK);
      }
    }

    const rockColliders = createRockColliders(this, rockData);
    const waterColliders = createWaterEffects(this, MAP_DATA);

    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin not setup');
      return;
    }
    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#inventory = new Inventory(this, this.#controls, this.physics.world.drawDebug);
    this.#crafting = new Crafting(this, this.#controls, this.#inventory, this.physics.world.drawDebug);
    this.#machineInterface = new FurnaceInterface(this, this.physics.world.drawDebug);
    this.#ribbon = new Ribbon(this);
    this.#shopInterface = new ShopInterface(this);
    Interactibles.onEntityDied = (key, amount) => this.#inventory.addItems(key, amount);
    Ore.onResourceMined = (key) => this.#inventory.addItems(key, 1);
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.#player = new Player({
      scene: this,
      position: PLAYER_POSITION,
      assetKey: 'PLAYER_IDLE',
      frame: 0,
      controls: this.#controls,
    });

    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.#player);

    this.#player.setDepth(DEPTH.ENTITY);

    //Refresh do grupo interactibles através de um evento (desaparecer ore)
    this.#interactibles = this.physics.add.staticGroup();
    this.#placement = new PlacementSystem(this, this.#interactibles, this.#player);
    
    this.#debugPlacement = new DebugPlacement(this.#placement, this.input.keyboard);

    this.#placement.onPlacement = (obj) => {
      if (obj instanceof Machine) {
        this.#machines.push(obj);
        if (!(obj instanceof Conveyer)) {
          this.#interactiblesMinusConveyors.add(obj);
          obj.setDebugVisible(true);
        }
      }
    };
    this.#placement.isTileBlocked = (tileX, tileY) => {
      const ground = MAP_DATA[tileY]?.[tileX];
      if (ground === undefined) return true;
      if (ground === TILES.WATER) return true; //Tiles de agua    

      const rock = rockData[tileY]?.[tileX];
      if (rock !== undefined && rock !== -1) return true; //Terreno elevado
      return false;
    };

    // Consume one of the placed item per placement and report how many remain,
    this.#placement.onConsume = (itemKey) => {
      this.#inventory.removeItems(itemKey, 1);
      return this.#inventory.countAllOf(itemKey);
    };

    // populate the world with entities
    spawnInteractibles(this, this.#interactibles, this.physics.world.drawDebug);

    // instanciate shop
    this.#shop = new Shop({ scene: this, position: SHOP_POSITION });
    this.#machines.push(this.#shop);
    this.#interactibles.add(this.#shop);

    // Build a separate group excluding conveyors for collision
    this.#interactiblesMinusConveyors = this.physics.add.staticGroup();
    this.#interactibles.getChildren().forEach(obj => {
      if (!(obj instanceof Conveyer)) {
        this.#interactiblesMinusConveyors.add(obj);
      }
    });

    // add colliders
    this.physics.add.collider(this.#player, this.#interactiblesMinusConveyors);
    this.physics.add.collider(this.#player, rockColliders);
    this.physics.add.collider(this.#player, waterColliders);

    // enable debug visualization only for objects that have colliders
    this.#interactiblesMinusConveyors.getChildren().forEach(obj => {
      if (obj instanceof Interactibles) {
        obj.setDebugVisible(true);
      }
    });
    
    this.input.on('gameobjectdown', (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      if (obj instanceof Interactibles && this.#player.nearInteractibles.has(obj)) {
        Interactibles.setSelected(obj);
      }
    });

    // Load saved game
    if ((this.scene.settings.data as { loadFromSave?: boolean })?.loadFromSave === true) {
      loadGame(this.#shop, this.#player);
      restoreMachines(this, this.#interactibles, this.#machines, this.#interactiblesMinusConveyors, SaveManager.getSavedMachines());
      restoreEntityStates(this.#interactibles);
      loadInventory(this.#inventory);
    }

    this.#hints = new Hints(this);
  }

  update(_time: number, delta: number) {
    this.#hints.showPlacementHint(this.#placement.isActive);
    this.#hints.showDemolishHint(this.#demolishMode);

    if (this.#controls.isZKeyJustDown) {
      this.#demolishMode = !this.#demolishMode;
      this.data.set('demolishMode', this.#demolishMode);
    }

    // Q → Save game
    if (this.#controls.isQKeyJustDown) {
      const entityStates: { id: number; health: number }[] = [];
      this.#interactibles.getChildren().forEach(obj => {
        if (obj instanceof Interactibles && obj.entityId > 0) {
          entityStates.push({ id: obj.entityId, health: obj.health });
        }
      });
      const machinesToSave = this.#machines.filter(m => !(m instanceof Shop));
        
      const machineStates = machinesToSave.map(m => {
        const typeKey = (m.constructor as { craftKey?: string }).craftKey ?? 'UNKNOWN';
        const facing = (m as { facing?: Direction }).facing ?? 'right';
        const stacks = (m as { stacks?: StackData[] }).stacks ?? [];
        
        return {
          typeKey: typeKey,
          x: m.x,
          y: m.y,
          facing: facing,
          health: m.health,
          stacks: stacks,
        };
      });
      SaveManager.save(this.#shop.points, this.#player.x, this.#player.y, this.#inventory.getSlotsData(), entityStates, machineStates);
      this.#hints.showSaveHint(true);
      this.time.delayedCall(2000, () => this.#hints.showSaveHint(false));
    }

    this.#debugPlacement.handleInput();

    for (let i = this.#machines.length - 1; i >= 0; i--) {
      const m = this.#machines[i];
      if (m.isDead) {
        m.cleanupIfDead();
        this.#machines.splice(i, 1);
      } else {
        m.update(delta);
      }
    }
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

    //Click Interactibles
    const isDown = this.input.activePointer.isDown;
    const justClicked = isDown && !this.#wasPointerDown;
    this.#wasPointerDown = isDown;

    if (!this.#inventory.isOpen) {
      if (this.#controls.isXKeyJustDown){
        this.#placement.cancel();
      }
      if (this.#controls.isRKeyJustDown){
        this.#placement.rotate();
      }
      this.#placement.update(justClicked);

      if (justClicked && !this.#placement.isActive) {
        const hovered = Interactibles.currentHovered;
        if (hovered && !hovered.isDead && this.#player.nearInteractibles.has(hovered)) {
          if (this.#demolishMode && hovered instanceof Machine && !(hovered instanceof Shop)) {
            Interactibles.setSelected(hovered);
            this.#player.act('ACT_HAMMER', 1);
            return;
          } else if (hovered instanceof Machine && hovered.interfacable && !(hovered instanceof Shop)) {
            // Bind the interface to the selected furnace so its stacks
            // are owned by the machine instance itself.
            this.#machineInterface.bind(hovered);
            // Wire any furnace slot click to transfer items into player inventory
            this.#machineInterface.onSlotTransfer = (slotIndex: number, itemKey: string, amount: number) => {
              const machine = this.#machineInterface.currentMachine;
              if (!machine) return;
              const stack = machine.stacks[slotIndex];
              if (!stack || stack.itemKey !== itemKey) return;

              let transferred = 0;
              for (let i = 0; i < amount; i++) {
                if (this.#inventory.addOneItem(itemKey)) transferred++;
                else break;
              }
              stack.amount -= transferred;
              if (stack.amount <= 0) { stack.itemKey = null; stack.amount = 0; }
            };

            if (!this.#inventory.isOpen) {
              this.#inventory.toggle();
            }
            // Wire inventory clicks to transfer items into the bound machine's
            // input slot.
            //   Normal click  → transfer 1 item.
            //   Shift+click   → transfer as many as possible from that stack.
            this.#inventory.onSlotClick = (itemKey, shiftKey) => {
              if (shiftKey) {
                // Transfer as many as possible
                const count = this.#inventory.countAllOf(itemKey);
                if (count > 0) {
                  const accepted = this.#machineInterface.tryAddToInputAmount(itemKey, count);
                  if (accepted > 0) {
                    this.#inventory.removeItems(itemKey, accepted);
                  }
                }
              } else {
                // Transfer 1
                if (this.#inventory.hasEnoughOf(itemKey, 1) &&
                    this.#machineInterface.tryAddToInput(itemKey)) {
                  this.#inventory.removeItems(itemKey, 1);
                }
              }
            };
          } else if (hovered instanceof Shop) {
            this.#shopInterface.open();
            if (!this.#inventory.isOpen) {
              this.#inventory.toggle();
            }
            // Wire inventory clicks to consume 1 item and add the item's price to banner points.
            //   Normal click  → sell 1 item.
            //   Shift+click   → sell as many as possible of that item.
            this.#inventory.onSlotClick = (itemKey, shiftKey) => {
              const price = PRICES.get(itemKey);
              if (!price) return;
              if (shiftKey) {
                const count = this.#inventory.countAllOf(itemKey);
                this.#inventory.removeItems(itemKey, count);
                this.#shop.addPoints(price * count);
              } else {
                if (this.#inventory.hasEnoughOf(itemKey, 1)) {
                  this.#inventory.removeItems(itemKey, 1);
                  this.#shop.addPoints(price);
                }
              }
              this.sound.play('COIN_SOUND');
            };
          }
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

    this.#ribbon.display(this.#shop.points);
    this.#player.update();

    // Each frame, mirror the bound machine's stacks onto the interface visuals.
    if (this.#machineInterface.isOpen) {
      this.#machineInterface.update();
    }


    if (this.#controls.isEKeyJustDown) {
      if (this.#machineInterface.isOpen || this.#shopInterface.isOpen) {
        this.#inventory.onSlotClick = null;
        this.#machineInterface.onSlotTransfer = null;
        this.#machineInterface.close();
        this.#machineInterface.unbind();
        this.#shopInterface.close();
        if (this.#inventory.isOpen) {
          this.#inventory.toggle();
        }
        Interactibles.clearSelected();
      } else {
        this.#inventory.toggle();
        this.#crafting.toggle();

        if (this.#inventory.isOpen) {
          this.#inventory.onSlotClick = (itemKey) => {
            if (this.#placement.startByItem(itemKey)) {
              if (this.#inventory.isOpen) this.#inventory.toggle();
              if (this.#crafting.isOpen)  this.#crafting.toggle();
              this.#inventory.onSlotClick = null;
            }
          };
        } else {
          this.#inventory.onSlotClick = null;
        }
      }
    }
  }
}
