import type { Direction } from "../common/types";
import { DIR_OFFSET } from "../common/const";
import { Machine } from "../game-objects/machine";

export class MachineRegistry {
  private map = new Map<string, Machine>();

  private key(x: number, y: number): string {
    return `${x},${y}`;
  }

  register(machine: Machine): void {
    this.map.set(this.key(machine.x, machine.y), machine);
  }

  registerAt(machine: Machine, x: number, y: number): void {
    this.map.set(this.key(x, y), machine);
  }

  unregister(machine: Machine): void {
    // Remove all keys pointing to this machine
    for (const [key, m] of this.map) {
      if (m === machine) this.map.delete(key);
    }
  }

  get(x: number, y: number): Machine | undefined {
    return this.map.get(this.key(x, y));
  }

  getNeighbor(origin: Machine, dir: Direction): Machine | undefined {
    const off = DIR_OFFSET[dir];
    return this.get(origin.x + off.x, origin.y + off.y);
  }
}

export const registry = new MachineRegistry();