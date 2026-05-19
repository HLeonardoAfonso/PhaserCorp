// ============================================================
// TILE LABELS
// ============================================================
// The tileset Tilemap_color1.png is 9×6 tiles of 64×64px each.
// Tile indices go row-by-row left-to-right:
//   Row 0: indices  0 -  8
//   Row 1: indices  9 - 17
//   Row 2: indices 18 - 26
//   Row 3: indices 27 - 35
//   Row 4: indices 36 - 44
//   Row 5: indices 45 - 53
//
// Edit the TILES object below to give meaningful names
// to each tile after inspecting the tileset image.
// ============================================================
export const TILES = {

  WATER:      4,

  // -- 1st square -- 
  WATER_GRASS_UP_LEFT:        0,
  WATER_GRASS_UP:             1,
  WATER_GRASS_UP_RIGHT:       2,

  WATER_GRASS_MID_LEFT:       9,
  WATER_GRASS_MID:            10,
  WATER_GRASS_MID_RIGHT:      11,

  WATER_GRASS_DOWN_LEFT:      18,   
  WATER_GRASS_DOWN:           19,   
  WATER_GRASS_DOWN_RIGHT:     20,
  
  // -- vertical single 3-12-21
  WATER_GRASS_VERTICAL_UP:          3,
  WATER_GRASS_VERTICAL_MIDLE:       12,
  WATER_GRASS_VERTICAL_DOWN:        21,

  // -- horizontal single 27-28-29
  WATER_GRASS_HORIZONTAL_LEFT:      27,
  WATER_GRASS_HORIZONTAL_MIDLE:     28,
  WATER_GRASS_HORIZONTAL_RIGHT:     29,

  WATER_GRASS_SINGLE:         30,

  // -- 2nd square -- 
  ROCK_GRASS_UP_LEFT:        5,
  ROCK_GRASS_UP:             6,
  ROCK_GRASS_UP_RIGHT:       7,

  ROCK_GRASS_MID_LEFT:       14,
  ROCK_GRASS_MID:            15,
  ROCK_GRASS_MID_RIGHT:      16,

  ROCK_GRASS_DOWN_LEFT:      23,   
  ROCK_GRASS_DOWN:           24,   
  ROCK_GRASS_DOWN_RIGHT:     25,

  // -- vertical single 
  ROCK_GRASS_VERTICAL_UP:          8,
  ROCK_GRASS_VERTICAL_MIDLE:       17,
  ROCK_GRASS_VERTICAL_DOWN:        26,

  // -- horizontal single 
  ROCK_GRASS_HORIZONTAL_LEFT:      32,
  ROCK_GRASS_HORIZONTAL_MIDLE:     33,
  ROCK_GRASS_HORIZONTAL_RIGHT:     34,

  ROCK_GRASS_SINGLE:         35,

  // ── Row 1 ──
  TILE_09:      9,   //
  TILE_10:     10,   //
  TILE_11:     11,   //
  TILE_12:     12,   //
  TILE_13:     13,   //
  TILE_14:     14,   //
  TILE_15:     15,   //
  TILE_16:     16,   //
  TILE_17:     17,   //

  // ── Row 2 ──
  TILE_18:     18,   //
  TILE_19:     19,   //
  TILE_20:     20,   //
  TILE_21:     21,   //
  TILE_22:     22,   //
  TILE_23:     23,   //
  TILE_24:     24,   //
  TILE_25:     25,   //
  TILE_26:     26,   //

  // ── Row 3 ──
  TILE_27:     27,   //
  TILE_28:     28,   //
  TILE_29:     29,   //
  TILE_30:     30,   //
  TILE_31:     31,   //
  TILE_32:     32,   //
  TILE_33:     33,   //
  TILE_34:     34,   //
  TILE_35:     35,   //

  // ── Row 4 ──
  TILE_36:     36,   //
  TILE_37:     37,   //
  TILE_38:     38,   //
  TILE_39:     39,   //
  TILE_40:     40,   //
  TILE_41:     41,   //
  TILE_42:     42,   //
  TILE_43:     43,   //
  TILE_44:     44,   //

  // ── Row 5 ──
  TILE_45:     45,   //
  TILE_46:     46,   //
  TILE_47:     47,   //
  TILE_48:     48,   //
  TILE_49:     49,   //
  TILE_50:     50,   //
  TILE_51:     51,   //
  TILE_52:     52,   //
  TILE_53:     53,   //
} as const;

// ============================================================
// WATER TILES
// ============================================================
// Tile indices that should have animated water foam behind them.
// Add any tile index here that represents water or a water-adjacent tile.
// ============================================================
export const WATER_TILES: number[] = [

  TILES.WATER_GRASS_UP_LEFT,
  TILES.WATER_GRASS_UP,
  TILES.WATER_GRASS_UP_RIGHT,
  TILES.WATER_GRASS_MID_LEFT,
  TILES.WATER_GRASS_MID_RIGHT,
  TILES.WATER_GRASS_DOWN_LEFT,
  TILES.WATER_GRASS_DOWN,
  TILES.WATER_GRASS_DOWN_RIGHT,
  TILES.WATER_GRASS_SINGLE,
  TILES.WATER_GRASS_VERTICAL_UP,
  TILES.WATER_GRASS_VERTICAL_MIDLE,
  TILES.WATER_GRASS_VERTICAL_DOWN,
  TILES.WATER_GRASS_HORIZONTAL_LEFT,
  TILES.WATER_GRASS_HORIZONTAL_MIDLE,
  TILES.WATER_GRASS_HORIZONTAL_RIGHT,
];

// CHUNKS ARE 16x16

export const CHUNK_00: number[][] = [
  [0,0,0,0 ,0,0,0,0 ,0,0,0,0 ,0,0,0,0],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],

  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],

  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],

  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,1],
  [0,0,0,0 ,0,0,0,0 ,0,0,0,0 ,0,0,0,0],
];

const CHUNK_01: number[][] = [
  [0,0,0,0 ,0,0,0,0 ,0,0,0,0 ,0,0,0,0],
  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [0,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],

  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,0,1,0,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,0 ,1,0,0,0 ,1,1,1,1 ,1,1,1,0],
  [1,1,0,1 ,1,1,0,1 ,1,1,1,1 ,1,1,1,0],

  [1,1,1,0 ,1,0,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,0,0,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,1,0,1,0 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],

  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [1,1,1,1 ,1,1,1,1 ,1,1,1,1 ,1,1,1,0],
  [0,0,0,0 ,0,0,0,0 ,0,0,0,0 ,0,0,0,0],
];

type chunk = number[][];
type world = chunk[][]

type NeighborEdges = {
  up?:    number[];  // bottom row of chunk above  (16 values)
  down?:  number[];  // top row of chunk below     (16 values)
  left?:  number[];  // right column of chunk left  (16 values)
  right?: number[];  // left column of chunk right  (16 values)
}

export const WORLD: world = [
  [CHUNK_00, CHUNK_01],
]


function getNeighborEdges(world: world, chunkRow: number, chunkCol: number): NeighborEdges {
  return {
    up:    chunkRow > 0        ? world[chunkRow-1][chunkCol][15] : undefined,
    down:  chunkRow < world.length-1 ? world[chunkRow+1][chunkCol][0] : undefined,
    left:  chunkCol > 0        ? world[chunkRow][chunkCol-1].map(r => r[15]) : undefined,
    right: chunkCol < world[0].length-1 ? world[chunkRow][chunkCol+1].map(r => r[0]) : undefined,
  };
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

function convertChunk(chunk: chunk, edges?: NeighborEdges): chunk {
  const converted: chunk = Array.from({ length: 16 }, () => new Array(16).fill(0));

  const MAP: Record<number, number> = {
    0b0000: TILES.WATER_GRASS_MID,              // no water

    0b0001: TILES.WATER_GRASS_UP,               // up
    0b0010: TILES.WATER_GRASS_DOWN,             // down
    0b0100: TILES.WATER_GRASS_MID_LEFT,         // left
    0b1000: TILES.WATER_GRASS_MID_RIGHT,        // right

    0b0101: TILES.WATER_GRASS_UP_LEFT,          // up + left
    0b0110: TILES.WATER_GRASS_DOWN_LEFT,        // down + left

    0b1001: TILES.WATER_GRASS_UP_RIGHT,         // up + right
    0b1010: TILES.WATER_GRASS_DOWN_RIGHT,       // down + right

    0b0011: TILES.WATER_GRASS_HORIZONTAL_MIDLE, // up + down
    0b0111: TILES.WATER_GRASS_HORIZONTAL_LEFT,  // up + down + left
    0b1011: TILES.WATER_GRASS_HORIZONTAL_RIGHT, // up + down + right

    0b1100: TILES.WATER_GRASS_VERTICAL_MIDLE,   // left + right
    0b1101: TILES.WATER_GRASS_VERTICAL_UP,      // up + left + right
    0b1110: TILES.WATER_GRASS_VERTICAL_DOWN,    // down + left + right

    0b1111: TILES.WATER_GRASS_SINGLE,           // all 4 sides
  };

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
        converted[i][f] = MAP[code];
      }
    }
  }
  return converted;
}
