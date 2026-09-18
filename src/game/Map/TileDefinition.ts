import type { TileType } from "./TileType";

//type' is basically a struct in c#

export type TileDefinition = {
    type: TileType;
    isSolid: boolean;
    color: number; //later will be a sprite maybe
};