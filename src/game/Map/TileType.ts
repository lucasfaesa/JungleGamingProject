//type of tile
export const TileType = {
    Water: 0,
    Sand: 1,
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];