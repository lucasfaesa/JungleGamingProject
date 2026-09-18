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
}