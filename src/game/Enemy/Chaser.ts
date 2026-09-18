import { Graphics, type Point } from "pixi.js";
import type { Player } from "../Player/Player";
import { EnemyShip } from "./EnemyShip";
import type { TilemapData } from "../Map/TilemapData";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";

export class Chaser extends EnemyShip {

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData) {
        super(newPosition, player, tilemapData);


        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Enemy; 

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xFFFF00)
        );

        console.log("Chaser Spawned");
    }

    public onCollision(type: CollisionType, other?: ICollideable): void {
        super.onCollision(type, other);

        switch(type){
            case CollisionType.Player:
                this.destroy();
                console.log("Collision with player");
                break;
        }
    }

    
}