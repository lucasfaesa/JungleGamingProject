import { Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { TilemapData } from "./TilemapData";
import { TileInfo, TileType } from "./Tileset";
import type { IUpdateable } from "../Interfaces/IUpdateable";

//manages grid construction (rendering) and colision data in the future
export class TileMap extends Container implements IUpdateable {

    private tilemapData: TilemapData;
    private waterBackground!: TilingSprite;

    private waterScrollSpeedX: number = 8;
    private waterScrollSpeedY: number = 4;

    constructor(tilemapData: TilemapData) {
        super();
        this.tilemapData = tilemapData;
        this.buildMap();
    }

    //moving effect for the water
    public update(deltaTime: number): void {
        this.waterBackground.tilePosition.x += this.waterScrollSpeedX * deltaTime;
        this.waterBackground.tilePosition.y += this.waterScrollSpeedY * deltaTime;
    }

    private buildMap(): void {
        const totalWidth = this.tilemapData.columns * this.tilemapData.tile_width;
        const totalHeight = this.tilemapData.rows * this.tilemapData.tile_height;

        // water background covering whole screen using TilingSprite
        const waterTexture = Assets.get("water");
        this.waterBackground = new TilingSprite({
            texture: waterTexture,
            width: totalWidth,
            height: totalHeight,
        });
        this.addChild(this.waterBackground);

        // 2. Only instantiate solid / island tiles on top
        const grid = this.tilemapData.getGrid();

        for (let row = 0; row < this.tilemapData.rows; row++) {
            for (let col = 0; col < this.tilemapData.columns; col++) {
                const tileId = grid[row][col];

                const tileDef = TileInfo.getTile(tileId);

                // now skipping drawing water as it is drawn by TilingSprite
                if (tileDef.type === TileType.Water) {
                    continue;
                }

                const tileAlias = this.getIslandTileAlias(col, row);
                const tileSprite = Sprite.from(tileAlias);

                tileSprite.width = this.tilemapData.tile_width;
                tileSprite.height = this.tilemapData.tile_height;
                tileSprite.position.set(col * this.tilemapData.tile_width, row * this.tilemapData.tile_height);

                this.addChild(tileSprite);
            }
        }
    }

    //auto assign island sprites based on their neighbours
    private getIslandTileAlias(col: number, row: number): string {
        const isNorth = this.isSand(col, row - 1);
        const isSouth = this.isSand(col, row + 1);
        const isWest  = this.isSand(col - 1, row);
        const isEast  = this.isSand(col + 1, row);

        // Top edge
        if (!isNorth && isSouth) {
            if (!isWest && isEast) return "islandTopLeft";
            if (isWest && !isEast) return "islandTopRight";
            return "islandTopMiddle";
        }

        // Bottom edge
        if (isNorth && !isSouth) {
            if (!isWest && isEast) return "islandBottomLeft";
            if (isWest && !isEast) return "islandBottomRight";
            return "islandMiddleBottom";
        }

        // Vertical middle edges
        if (!isWest && isEast) return "islandMiddleLeft";
        if (isWest && !isEast) return "islandMiddleRight";

        // Center
        return "islandCenter";
    }

    private isSand(col: number, row: number): boolean {
        const tile = this.tilemapData.getTileAt(col, row);
        return tile === TileType.Sand;
    }

    public isSolidAt(worldX: number, worldY: number): boolean {
        const col = Math.floor(worldX / this.tilemapData.tile_width);
        const row = Math.floor(worldY / this.tilemapData.tile_height);

        const tileId = this.tilemapData.getTileAt(col, row);

        // Outside boundary is solid (arena border)
        if (tileId === null) {
            return true;
        }

        return TileInfo.getTile(tileId).isSolid;
    }

    /**
     * Checks if there is an unobstructed line of sight between two world positions.
     * Steps in increments (32px) from start to end, checking if any step hits a solid tile.
     */
    public hasLineOfSight(x1: number, y1: number, x2: number, y2: number): boolean {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Half tile size ensures no solid tile is skipped during the raycast
        const stepSize = 32;
        const steps = Math.floor(distance / stepSize);

        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const checkX = x1 + dx * t;
            const checkY = y1 + dy * t;

            if (this.isSolidAt(checkX, checkY)) {
                return false; // View is blocked by an obstacle
            }
        }

        return true; // Clear line of sight
    }
}