import { Ore } from "../game-objects/ore";

export class OreRegistry {
  private map = new Map<string, Ore>();

  private tileKey(x: number, y: number): string {
    const tileX = Math.floor(x / 64);
    const tileY = Math.floor(y / 64);
    return `${tileX},${tileY}`;
  }

  register(ore: Ore): void {
    this.map.set(this.tileKey(ore.x, ore.y), ore);
  }

  unregister(ore: Ore): void {
    const key = this.tileKey(ore.x, ore.y);
    if (this.map.get(key) === ore) {
      this.map.delete(key);
    }
  }

  getAt(tileX: number, tileY: number): Ore | undefined {
    return this.map.get(`${tileX},${tileY}`);
  }
}

export const oreRegistry = new OreRegistry();