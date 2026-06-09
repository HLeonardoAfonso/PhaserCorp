

const SMELTING_RECIPES: [string, string][] = [
    ['COPPER_ITEM', 'COPPER_PLATE'],
    ['IRON_ITEM', 'IRON_PLATE'],
];

export const SMELT_MAP = new Map<string, string>(SMELTING_RECIPES);

export const CRAFTING_RECIPES: [string, string][] = [
    ['COPPER_PLATE', 'COPPER_WIRE'],
    ['IRON_PLATE', 'IRON_GEAR'],
];

export const FUEL_ITEMS: string[] = [
    'COAL_ITEM', 'WOOD_ITEM'
]

export const ORE_ITEMS: string[] = [
    'IRON_ITEM', 'COPPER_ITEM'
]