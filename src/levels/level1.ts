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

  // -- 1 square -- 

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

  // -- horizontal single 27-28-29

  WATER_GRASS_SINGLE:         30,

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
  TILES.WATER_GRASS_MID,
  TILES.WATER_GRASS_MID_RIGHT,
  TILES.WATER_GRASS_DOWN_LEFT,
  TILES.WATER_GRASS_DOWN,
  TILES.WATER_GRASS_DOWN_RIGHT,
  TILES.WATER_GRASS_SINGLE,
];

// ============================================================
// LEVEL MAP (22 columns × 13 rows)
// ============================================================
// The game canvas is 22×13 tiles.
// Edit this 2D array to build your map layout.
// Each number is a tile index from the tileset.
// Use the TILES constants above for readability.
//
// Example: TILES.GRASS_1, TILES.TILE_09, etc.
// ============================================================
const MAP_DATA: number[][] = [
  // Row  0
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  // Row  1
  [4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4],
  // Row  2
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  3
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  4
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  5
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  6
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  7
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  8
  [4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row  9
  [4,18,19,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row 10
  [4, 4, 4, 9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11, 4],
  // Row 11
  [4,30, 4,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20, 4],
  // Row 12
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];

export default MAP_DATA;