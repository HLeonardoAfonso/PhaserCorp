import Phaser from 'phaser';
import type { InteractiblesConfig } from './interactibles';
import { Tree } from './tree';
import { GoldStone } from './ores/gold-stone';
import { IronStone } from './ores/iron-stone';
import { CoalStone } from './ores/coal-stone';
import { CopperStone } from './ores/copper-stone';
import { Conveyer } from './machines/conveyer';
import { ConveyerCurve } from './machines/conveyer-curve';

type EntityClass = new (config: InteractiblesConfig) => any;

const entities: [EntityClass, { x: number; y: number }][] = [
  [Tree,          { x: (1 * 64) + 32,  y: (2 * 64) + 32 }],
  [Tree,          { x: (3 * 64) + 32,  y: (3 * 64) + 32 }],
  [Tree,          { x: (6 * 64) + 32,  y: (3 * 64) + 32 }],
  [GoldStone,     { x: (4 * 64) + 32,  y: (2 * 64) + 32 }],
  [IronStone,     { x: (8 * 64) + 32,  y: (2 * 64) + 32 }],
  [CopperStone,   { x: (8 * 64) + 32,  y: (4 * 64) + 32 }],
  [CoalStone,     { x: (10 * 64) + 32, y: (2 * 64) + 32 }],
  [Conveyer,      { x: (12 * 64) + 32, y: (2 * 64) + 32 }],
];

export function spawnInteractibles(
  scene: Phaser.Scene,
  interactibles: Phaser.Physics.Arcade.StaticGroup,
  debug: boolean
): void {
  for (const [EntityClass, position] of entities) {

    // create entities
    const entity = new EntityClass({ scene, position });
    // add debug square
    if (debug) scene.input.enableDebug(entity);
    // add entities to intecatables group
    interactibles.add(entity);

  }
}