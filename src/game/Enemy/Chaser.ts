import { type Point } from "pixi.js";
import type { Player } from "../Player/Player";
import { EnemyShip } from "./EnemyShip";
import type { TilemapData } from "../Map/TilemapData";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";
import { InterfaceHelper } from "../Interfaces/InterfaceHelper";
import { RandomHelper } from "../Helpers/RandomHelper";

export class Chaser extends EnemyShip {

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData) {
        super(newPosition, player, tilemapData);

        this.moveSpeed = RandomHelper.randomInt(110, 120);
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Enemy; 
        this.ignoredCollisionLayers = [CollisionType.EnemyProjectile, CollisionType.Enemy];
        this.initializeHealth(2);
        this.damage = 3;

        
        //sprite
        this.setSpriteByName("chaserShip");

        console.log("Chaser Spawned");
    }

    public onCollision(type: CollisionType, otherCollideable: ICollideable): void {
        super.onCollision(type, otherCollideable);

        switch(type){
            case CollisionType.Player:
                if(InterfaceHelper.isDamageable(otherCollideable))
                    otherCollideable.onDamageTaken(this.damage);

                this.destroy();
                console.log("Collision with player");
            break;
            case CollisionType.PlayerProjectile:
            console.log("received damage from player projectile");

            if(InterfaceHelper.isDamageDealer(otherCollideable)){ //checking if other collideble implements IdamageDealer
                this.onDamageTaken(otherCollideable.damage);
            }
            break;
        }
    }    
}
