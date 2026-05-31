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

  // -- ramp

  ROCK_RAMP_UP_LEFT:         36,
  ROCK_RAMP_DOWN_LEFT:       45,

  ROCK_RAMP_UP_RIGHT:        39,
  ROCK_RAMP_DOWN_RIGHT:      48,

  // -- walls
  ROCK_WALL_GRASS_LEFT:          41,
  ROCK_WALL_GRASS_MID:           42,
  ROCK_WALL_GRASS_RIGHT:         43,

  ROCK_WALL_GRASS_SINGLE:           44,

  ROCK_WALL_WATER_LEFT:           50,
  ROCK_WALL_WATER_MID:            51,
  ROCK_WALL_WATER_RIGHT:          52,

  ROCK_WALL_WATER_SINGLE:            53,

} as const;

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

export const BINARY_MAP: Record<number, number> = {
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

export const ROCK_BINARY_MAP: Record<number, number> = {
  0b0000: TILES.ROCK_GRASS_MID,              // all 4 sides are level 2

  0b0001: TILES.ROCK_GRASS_UP,               // up
  0b0010: TILES.ROCK_GRASS_DOWN,             // down
  0b0100: TILES.ROCK_GRASS_MID_LEFT,         // left
  0b1000: TILES.ROCK_GRASS_MID_RIGHT,        // right

  0b0101: TILES.ROCK_GRASS_UP_LEFT,          // up + left
  0b0110: TILES.ROCK_GRASS_DOWN_LEFT,        // down + left

  0b1001: TILES.ROCK_GRASS_UP_RIGHT,         // up + right
  0b1010: TILES.ROCK_GRASS_DOWN_RIGHT,       // down + right

  0b0011: TILES.ROCK_GRASS_HORIZONTAL_MIDLE, // up + down
  0b0111: TILES.ROCK_GRASS_HORIZONTAL_LEFT,  // up + down + left
  0b1011: TILES.ROCK_GRASS_HORIZONTAL_RIGHT, // up + down + right

  0b1100: TILES.ROCK_GRASS_VERTICAL_MIDLE,   // left + right
  0b1101: TILES.ROCK_GRASS_VERTICAL_UP,      // up + left + right
  0b1110: TILES.ROCK_GRASS_VERTICAL_DOWN,    // down + left + right

  0b1111: TILES.ROCK_GRASS_SINGLE,           // all 4 sides are level 1
};