import { Machine } from "../machine";
import type { InteractiblesConfig } from "../interactibles";
import type { Direction } from "../../common/types";

export type RotatableConfig = InteractiblesConfig & {
    facing?: Direction;
};

export abstract class RotatableMachine extends Machine {

    readonly facing: Direction;

    constructor(config: RotatableConfig, health: number, assetKey: string, interfacable: boolean) {
        super(config, health, assetKey, interfacable);
        this.facing = config.facing ?? 'right';
    }
}