import { SaveManager } from './save-manager';
import type { Shop } from '../game-objects/shop';
import type { Player } from '../game-objects/player';
import type { Inventory } from '../components/game-object/inventory-component';

export function loadGame(shop: Shop, player: Player, inventory: Inventory): void {
    const data = SaveManager.load();
    if (!data) return;
    shop.setPoints(data.shopPoints);
    player.setPosition(data.player.x, data.player.y);
    inventory.setSlotsData(data.inventory);
}
