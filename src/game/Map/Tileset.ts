import type { TileDefinition } from "./TileDefinition";
import { TileType } from "./TileType";


//just a helper for tiles infos
export class TileInfo {
    private static readonly tiles: Record<TileType, TileDefinition> = {
        [TileType.Water]: {
            type: TileType.Water,
            isSolid: false,
            color: 0x1099bb,
        },
        [TileType.Sand]: {
            type: TileType.Sand,
            isSolid: true,
            color: 0xdeb887,
        },
    };

    public static getTile(id: TileType): TileDefinition {
        return this.tiles[id];
    }
}
export { TileType };

