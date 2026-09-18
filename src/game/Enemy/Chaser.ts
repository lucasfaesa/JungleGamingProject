import { Graphics, type Point } from "pixi.js";
import type { Player } from "../Player/Player";
import { EnemyShip } from "./EnemyShip";
import type { TileMap } from "../Map/TileMap";
import type { TilemapData } from "../Map/TilemapData";

export class Chaser extends EnemyShip {

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData) {
        super(newPosition, player, tilemapData);


        this.moveSpeed = 120;
        this.rotationSpeed = 3;

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xFFFF00)
        );

        console.log("Chaser Spawned");
    }

    

    
}