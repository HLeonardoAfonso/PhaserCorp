import Phaser from 'phaser';
import type { InteractiblesConfig } from './interactibles';
import { Tree } from './tree';
import { GoldStone } from './ores/gold-stone';
import { IronStone } from './ores/iron-stone';
import { CoalStone } from './ores/coal-stone';
import { CopperStone } from './ores/copper-stone';

type EntityClass = new (config: InteractiblesConfig) => any;

const entities: [EntityClass, { x: number; y: number }][] = [

  // 00
  [Tree,          { x: 1,  y: 2 }],
  [Tree,          { x: 3,  y: 3 }],
  [Tree,          { x: 6,  y: 3 }],

  [GoldStone,     { x: 4,  y: 2 }],

  // 01

  [Tree,          { x: 16+11, y: 8 }],
  [Tree,          { x: 16+12, y: 9 }],
  [Tree,          { x: 16+3, y: 10 }],

  // 02

  [Tree,          { x: 32+11, y: 8 }],
  [CopperStone,   { x: 32+3, y: 12 }],
  [CopperStone,   { x: 32+1, y: 12 }],
  [CopperStone,   { x: 32+2, y: 11 }],

  // 10

  [Tree,          { x: 10, y: 16+2 }],
  [Tree,          { x: 4, y: 16+10 }],
  [Tree,          { x: 13, y: 16+3 }],

  // 11

  [Tree,          { x: 16+10, y: 16+2 }],
  [Tree,          { x: 16+12, y: 16+3 }],
  [Tree,          { x: 16+4, y: 16+3 }],

  [Tree,          { x: 16+2, y: 16+10 }],
  [Tree,          { x: 16+3, y: 16+12 }],
  [Tree,          { x: 16+1, y: 16+11 }],

  // 12

  [Tree,          { x: 32+3, y: 16+5 }],
  [Tree,          { x: 32+10, y: 16 }],
  [Tree,          { x: 32+7, y: 16+13 }],

  // 20

  [Tree,          { x: 10, y: 32+2 }],
  [Tree,          { x: 12, y: 32+3 }],
  [Tree,          { x: 4, y: 32+3 }],

  [IronStone,     { x: 27, y: 27 }],
  [CopperStone,   { x: 31, y: 23 }],
  [CoalStone,     { x: 29, y: 25 }],
  
];

export function spawnInteractibles(
  scene: Phaser.Scene,
  interactibles: Phaser.Physics.Arcade.StaticGroup,
  debug: boolean
): void {
  for (const [EntityClass, position] of entities) {

    // create entities
    const correctPosition = { x: (position.x * 64) + 32, y: (position.y * 64) + 32 }
    const entity = new EntityClass({ scene, position: correctPosition });
    // add debug square
    if (debug) scene.input.enableDebug(entity);
    // add entities to intecatables group
    interactibles.add(entity);

  }
}