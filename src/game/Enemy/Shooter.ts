import { Graphics, Point } from "pixi.js";
import type { IShooter } from "../Interfaces/IShooter";
import { EnemyShip } from "./EnemyShip";
import type { TilemapData } from "../Map/TilemapData";
import type { TileMap } from "../Map/TileMap";
import type { Player } from "../Player/Player";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";
import { Canon } from "../projectile/Canon";
import { InterfaceHelper } from "../Interfaces/InterfaceHelper";

export class Shooter extends EnemyShip implements IShooter{
    
    private stopDistance : number = 300;
    private shotDelay : number = 1.1;
    private timerToStartMovingAgain : number = 1.5;

    protected repulsionRadius: number = 2.5;

    private frontCanon : Canon;
    private tileMap : TileMap;
        
    private currentDelayTimer : number = 0;
    private currentTimerToStartMovingAgain : number = 0;

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData, tileMap: TileMap) {
        super(newPosition, player, tilemapData);

        this.tileMap = tileMap;
        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Enemy; 
        this.canMove = false;
        this.ignoredCollisionLayers = [CollisionType.EnemyProjectile, CollisionType.Enemy];

        this.health = 4;
        this.damage = 1;

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xFF00FF)
        );

        const projectileCollisionsToIgnore: CollisionType[] = [  CollisionType.Enemy,  CollisionType.EnemyProjectile];
        this.frontCanon = new Canon(new Point(0, -16), 0, this.damage, CollisionType.EnemyProjectile, projectileCollisionsToIgnore);
        this.addChild(this.frontCanon);
        
        console.log("Shooter Spawned");
    }
    
    public update(deltaTime: number): void {
        super.update(deltaTime);

        if(!this.targetPlayer.isAlive)
            return;

        //ignores islands
        const inRangeToShootPlayer = this.getDistanceToPlayer() <= this.stopDistance;

        //player not behind a island
        const canSeePlayer = this.tileMap.hasLineOfSight(
            this.position.x,
            this.position.y,
            this.targetPlayer.position.x,
            this.targetPlayer.position.y
        );

        //in range and not behind a island
        if(inRangeToShootPlayer && canSeePlayer){
            this.canMove = false;
            this.currentTimerToStartMovingAgain = this.timerToStartMovingAgain; //enemy stops for a bit before moving again
            this.tryShootAtPlayer(deltaTime);
        }
        else{
            // Even if slightly out of range, keep shooting briefly if we still have clear sight
            if(this.currentTimerToStartMovingAgain > 0 && canSeePlayer){
                this.canMove = false;
                this.currentTimerToStartMovingAgain -= deltaTime; //even if the player leaves the line of sight, it doesnt start moving right away, waits a bit
                this.tryShootAtPlayer(deltaTime);
            }else{
                this.canMove = true;
            }
        }
    }
    
    public onCollision(type: CollisionType, otherCollideable?: ICollideable): void {
        super.onCollision(type, otherCollideable);

        switch(type){
            case CollisionType.Player:    
                //nothing for now
            break;
            case CollisionType.PlayerProjectile:
                console.log("received damage from player projectile");
                
                if(InterfaceHelper.isDamageDealer(otherCollideable)){ //checking if other collideble implements IdamageDealer
                    this.onDamageTaken(otherCollideable.damage);
                }
            break;
        }
    }

    private tryShootAtPlayer(deltaTime : number){
        if(this.currentDelayTimer > 0){
            this.currentDelayTimer -= deltaTime;
        }
        else{
            this.currentDelayTimer = this.shotDelay;
            this.shoot();
        }
    }
    
    shoot(): void {
        this.frontCanon.shoot();
    }


}