import Phaser from 'phaser';
import type { InteractiblesConfig } from './interactibles';
import { Tree } from './tree';
import { GoldStone } from './ores/gold-stone';
import { IronStone } from './ores/iron-stone';
import { CoalStone } from './ores/coal-stone';
import { CopperStone } from './ores/copper-stone';
import { SaveManager } from '../systems/save-manager';
import { Interactibles } from './interactibles';

type EntityClass = new (config: InteractiblesConfig) => any;

const entities: [number, EntityClass, { x: number; y: number }][] = [

  // 00
  [0, Tree,          { x: 1,  y: 2 }],
  [1, Tree,          { x: 3,  y: 3 }],
  [2, Tree,          { x: 6,  y: 3 }],

  [3, GoldStone,     { x: 4,  y: 2 }],

  // 01

  [4, Tree,          { x: 16+11, y: 8 }],
  [5, Tree,          { x: 16+12, y: 9 }],
  [6, Tree,          { x: 16+3, y: 10 }],

  // 02

  [7, Tree,          { x: 32+11, y: 8 }],
  [8, CopperStone,   { x: 32+3, y: 12 }],
  [9, CopperStone,   { x: 32+1, y: 12 }],
  [10, CopperStone,   { x: 32+2, y: 11 }],
  [11, CoalStone,     { x: 32+8, y: 5 }],
  [12, CoalStone,     { x: 32+11, y: 7 }],

  // 10

  [13, Tree,          { x: 10, y: 16+2 }],
  [14, Tree,          { x: 4, y: 16+10 }],
  [15, Tree,          { x: 13, y: 16+3 }],
  [16, Tree,          { x: 10, y: 16+15 }],
  [17, Tree,          { x: 11, y: 16+7 }],
  [18, Tree,          { x: 12, y: 16+8 }],
  [19, Tree,          { x: 13, y: 16+7 }],
  [20, Tree,          { x: 11, y: 16+8 }],

  [21, CoalStone,     { x: 5, y: 16+6 }],
  [22, CoalStone,     { x: 5, y: 16+8 }],
  [23, CoalStone,     { x: 3, y: 16+9 }],
  [24, CoalStone,     { x: 6, y: 16+4 }],

  [25, IronStone,     { x: 13, y: 16+12 }],
  [26, IronStone,     { x: 10, y: 16+5 }],
  [27, IronStone,     { x: 10, y: 16+14 }],
  [28, IronStone,     { x: 12, y: 16+7 }],

  [29, CopperStone,   { x: 15, y: 16+3 }],
  [30, CopperStone,   { x: 11, y: 16+2 }],

  // 11

  [31, Tree,          { x: 16+10, y: 16+2 }],
  [32, Tree,          { x: 16+12, y: 16+3 }],
  [33, Tree,          { x: 16+4, y: 16+3 }],

  [34, Tree,          { x: 16+2, y: 16+10 }],
  [35, Tree,          { x: 16+3, y: 16+12 }],
  [36, Tree,          { x: 16+1, y: 16+11 }],

  [37, Tree,          { x: 16+14, y: 16+15 }],
  [38, Tree,          { x: 16+13, y: 16+14 }],
  [39, Tree,          { x: 16+12, y: 16+13 }],
  [40, Tree,          { x: 16+10, y: 16+13 }],
  [41, Tree,          { x: 16+15, y: 16+14 }],
  [42, Tree,          { x: 16+14, y: 16+13 }],
  [43, Tree,          { x: 16+13, y: 16+12 }],

  [44, Tree,          { x: 16+12, y: 16+14 }],
  [45, Tree,          { x: 16+16, y: 16+12 }],
  [46, Tree,          { x: 16+15, y: 16+13 }],

  [47, CoalStone,     { x: 16+13, y: 16+4 }],

  // 12

  [48, Tree,          { x: 32+3, y: 16+5 }],
  [49, Tree,          { x: 32+10, y: 16 }],
  [50, Tree,          { x: 32+7, y: 16+13 }],
  [51, Tree,          { x: 32+10, y: 16+5 }],
  [52, Tree,          { x: 32+13, y: 16+3 }],
  [53, Tree,          { x: 32+8, y: 16+12 }],

  [54, CoalStone,     { x: 32+10, y: 16+6 }],
  [55, IronStone,     { x: 32+12, y: 16+1 }],
  [56, CopperStone,   { x: 32+9, y: 16+12 }],

  // 20

  [57, Tree,          { x: 10, y: 32+2 }],
  [58, Tree,          { x: 12, y: 32+3 }],
  [59, Tree,          { x: 4, y: 32+3 }],
  [60, Tree,          { x: 13, y: 32+6 }],
  [61, Tree,          { x: 7, y: 32+7 }],
  [62, Tree,          { x: 10, y: 32+10 }],

  [63, IronStone,     { x: 5, y: 32+8 }],
  [64, IronStone,     { x: 6, y: 32+9 }],
  [65, IronStone,     { x: 5, y: 32+7 }],
  [66, IronStone,     { x: 10, y: 32+7 }],
  [67, IronStone,     { x: 10, y: 32+6 }],

  // 21

  [68, Tree,          { x: 16+10, y: 32+5 }],
  [69, Tree,          { x: 16+13, y: 32+3 }],
  [70, Tree,          { x: 16+8, y: 32+12 }],

  [71, CoalStone,     { x: 16+4, y: 32+12 }],

  // 22

  [72, Tree,          { x: 32+11, y: 32+6 }],
  [73, Tree,          { x: 32+12, y: 32+2 }],
  [74, Tree,          { x: 32+7, y: 32+13 }],

  [75, IronStone,     { x: 32+7, y: 32+8 }],
  [76, IronStone,     { x: 32+7, y: 32+12 }],

  [77, CopperStone,   { x: 32+4, y: 32+12 }],
  [78, CoalStone,     { x: 32+11, y: 32+2 }],

];

export function spawnInteractibles(
  scene: Phaser.Scene,
  interactibles: Phaser.Physics.Arcade.StaticGroup,
  _debug: boolean
): void {
  for (const [id, EntityClass, position] of entities) {
    const correctPosition = { x: (position.x * 64) + 32, y: (position.y * 64) + 32 };
    const obj = new EntityClass({ scene, position: correctPosition });
    obj.entityId = id;
    interactibles.add(obj);
  }
}

export function restoreEntityStates(interactibles: Phaser.Physics.Arcade.StaticGroup): void {
  const states = SaveManager.getSavedStates();

  interactibles.getChildren().forEach(obj => {
    if (!(obj instanceof Interactibles) || obj.entityId === 0) return;

    for (let i = 0; i < states.length; i++) {
      if (states[i].id === obj.entityId) {
        obj.takeDamage(obj.health - states[i].health);
        obj.update();
      }
    }
  });
}