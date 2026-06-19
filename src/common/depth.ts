export const DEPTH = {
  // World layers
  GROUND: 1,
  ROCK: 2,
  ENTITY: 3,
  SELECTION_CORNERS: 9999,
  TABLE_BG: 10000,     // Inventory banner, machine table, crafting table
  SLOT_DEBUG: 10001,
  SLOT_IMAGE: 10002,   // Slot items, machine image on interface, crafting images
  SLOT_TEXT: 10003,    // Amount text, shop overlay
  RIBBON_BG: 10004,
  RIBBON_TEXT: 10005,
  RECIPE_FRAME: 11000,
  RECIPE_IMAGE: 11001,

  MENU_PAPER: 10004,
} as const;