import { Container, Graphics } from "pixi.js";
import { TilemapData } from "./TilemapData";
import { TileInfo, TileType } from "./Tileset";


//manages grid construction (rendering) and colision data in the future
export class TileMap extends Container {

    private tilemapData: TilemapData;

    constructor(tilemapData: TilemapData) {
        super();
        this.tilemapData = tilemapData;
        this.buildMap();
    }

    private buildMap(): void {
        const grid = this.tilemapData.getGrid();

        for (let row = 0; row < this.tilemapData.rows; row++) {
            for (let col = 0; col < this.tilemapData.columns; col++) {
                const tileId = grid[row][col];

                const tileDef = TileInfo.getTile(tileId);

                const tileGraphic = new Graphics().rect(0, 0, this.tilemapData.tile_width, this.tilemapData.tile_height).fill(tileDef.color);

                tileGraphic.position.set(col * this.tilemapData.tile_width, row * this.tilemapData.tile_height);

                this.addChild(tileGraphic);
            }
        }
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