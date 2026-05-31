import type { world, chunk } from '../common/types';
import { TILES, BINARY_MAP, ROCK_BINARY_MAP, WATER_TILES } from './tile-config';

type NeighborEdges = {
  up?:    number[];  // bottom row of chunk above  (16 values)
  down?:  number[];  // top row of chunk below     (16 values)
  left?:  number[];  // right column of chunk left  (16 values)
  right?: number[];  // left column of chunk right  (16 values)
}


function getNeighborEdges(world: world, chunkRow: number, chunkCol: number): NeighborEdges {
  return {
    up:    chunkRow > 0                 ? world[chunkRow-1][chunkCol][15]             : undefined,
    down:  chunkRow < world.length-1    ? world[chunkRow+1][chunkCol][0]              : undefined,
    left:  chunkCol > 0                 ? world[chunkRow][chunkCol-1].map(r => r[15]) : undefined,
    right: chunkCol < world[0].length-1 ? world[chunkRow][chunkCol+1].map(r => r[0])  : undefined,
  };
}

function convertChunk(chunk: chunk, edges?: NeighborEdges): chunk {
  const converted: chunk = Array.from({ length: 16 }, () => new Array(16).fill(0));

  for (let i = 0; i < 16; i++) {
    for (let f = 0; f < 16; f++) {
      if (chunk[i][f] === 0) {
        converted[i][f] = TILES.WATER;  // water
      } else {
        let code = 0;
        // Up — water above (inside chunk or from neighbor above)
        if ((i > 0 && chunk[i-1][f] === 0) || (i === 0 && edges?.up?.[f] === 0)) code |= 0b0001;
        // Down — water below
        if ((i < 15 && chunk[i+1][f] === 0) || (i === 15 && edges?.down?.[f] === 0)) code |= 0b0010;
        // Left — water to the left
        if ((f > 0 && chunk[i][f-1] === 0) || (f === 0 && edges?.left?.[i] === 0)) code |= 0b0100;
        // Right — water to the right
        if ((f < 15 && chunk[i][f+1] === 0) || (f === 15 && edges?.right?.[i] === 0)) code |= 0b1000;
        converted[i][f] = BINARY_MAP[code];
      }
    }
  }
  return converted;
}

function convertRockChunk(chunk: chunk, edges?: NeighborEdges): chunk {
  const converted: chunk = Array.from({ length: 16 }, () => new Array(16).fill(-1));

  for (let i = 0; i < 16; i++) {
    for (let f = 0; f < 16; f++) {
      if (chunk[i][f] === 2) {
        let code = 0;
        // Up — not rock above (inside chunk or from neighbor above)
        if ((i > 0 && chunk[i-1][f] !== 2) || (i === 0 && edges?.up?.[f] !== 2)) code |= 0b0001;
        // Down — not rock below
        if ((i < 15 && chunk[i+1][f] !== 2) || (i === 15 && edges?.down?.[f] !== 2)) code |= 0b0010;
        // Left — not rock to the left
        if ((f > 0 && chunk[i][f-1] !== 2) || (f === 0 && edges?.left?.[i] !== 2)) code |= 0b0100;
        // Right — not rock to the right
        if ((f < 15 && chunk[i][f+1] !== 2) || (f === 15 && edges?.right?.[i] !== 2)) code |= 0b1000;

        // rock wall tile under
        if (code === 0b0010 || code === 0b0011) converted[i+1][f] = TILES.ROCK_WALL_GRASS_MID;
        if (code === 0b0110 || code === 0b0111) converted[i+1][f] = TILES.ROCK_WALL_GRASS_LEFT;
        if (code === 0b1010 || code === 0b1011) converted[i+1][f] = TILES.ROCK_WALL_GRASS_RIGHT;
        if (code === 0b1110 || code === 0b1111) converted[i+1][f] = TILES.ROCK_WALL_GRASS_SINGLE;

        converted[i][f] = ROCK_BINARY_MAP[code];
      }
    }
  }
  return converted;
}

export function createWorld(world: world): number[][] {
  const chunkRows = world.length;
  const chunkCols = world[0].length;
  const mapHeight = chunkRows * 16;
  const mapWidth  = chunkCols * 16;

  const result: number[][] = Array.from({ length: mapHeight }, () => new Array(mapWidth).fill(0));

  for (let chunkRow = 0; chunkRow < chunkRows; chunkRow++) {
    for (let chunkCol = 0; chunkCol < chunkCols; chunkCol++) {
      const edges = getNeighborEdges(world, chunkRow, chunkCol);
      const chunk = convertChunk(world[chunkRow][chunkCol], edges);
      for (let r = 0; r < 16; r++) {
        for (let c = 0; c < 16; c++) {
          result[chunkRow * 16 + r][chunkCol * 16 + c] = chunk[r][c];
        }
      }
    }
  }

  return result;
}

export function createRockLayer(world: world): number[][] {
  const chunkRows = world.length;
  const chunkCols = world[0].length;
  const mapHeight = chunkRows * 16;
  const mapWidth  = chunkCols * 16;

  const result: number[][] = Array.from({ length: mapHeight }, () => new Array(mapWidth).fill(-1));

  for (let chunkRow = 0; chunkRow < chunkRows; chunkRow++) {
    for (let chunkCol = 0; chunkCol < chunkCols; chunkCol++) {
      const edges = getNeighborEdges(world, chunkRow, chunkCol);
      const chunk = convertRockChunk(world[chunkRow][chunkCol], edges);
      for (let r = 0; r < 16; r++) {
        for (let c = 0; c < 16; c++) {
          result[chunkRow * 16 + r][chunkCol * 16 + c] = chunk[r][c];
        }
      }
    }
  }

  return result;
}

export function createWaterEffects(
  scene: Phaser.Scene,
  mapData: number[][]
): Phaser.Physics.Arcade.StaticGroup {
  const waterFoamSet = new Set(WATER_TILES);
  const waterColliders = scene.physics.add.staticGroup();

  for (let row = 0; row < mapData.length; row++) {
    for (let col = 0; col < mapData[row].length; col++) {
      // water foam render
      if (waterFoamSet.has(mapData[row][col])) {
        const foam = scene.add.sprite(col * 64 + 32, row * 64 + 32, 'WATER_FOAM', 0);
        foam.setDepth(0);
        foam.play('WATER_FOAM_ANIM');
      }
      // water collider
      if (mapData[row][col] === 4) {
        const waterZone = scene.add.zone(col * 64 + 32, row * 64 + 32, 64, 64);
        waterColliders.add(waterZone);
      }
    }
  }

  return waterColliders;
}