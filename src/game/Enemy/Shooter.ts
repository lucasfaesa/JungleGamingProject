import { Graphics, Point } from "pixi.js";
import type { IShooter } from "../Interfaces/IShooter";
import { EnemyShip } from "./EnemyShip";
import type { TilemapData } from "../Map/TilemapData";
import type { Player } from "../Player/Player";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";
import { Canon } from "../projectile/Canon";

export class Shooter extends EnemyShip implements IShooter{
    
    private stopDistance : number = 300;
    private shotDelay : number = 1.2;
    private timerToStartMovingAgain : number = 1.0;

    private frontCanon : Canon;
        
    private currentDelayTimer : number = 0;
    private currentTimerToStartMovingAgain : number = 0;

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData) {
        super(newPosition, player, tilemapData);

        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Enemy; 
        this.canMove = false;
        
        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xFF00FF)
        );

        this.frontCanon =  this.frontCanon = new Canon(new Point(0, -16), 0);
        this.addChild(this.frontCanon);
        
        console.log("Shooter Spawned");
    }
    
    public update(deltaTime: number): void {
        super.update(deltaTime);

        if(this.getDistanceToPlayer() <= this.stopDistance){
            this.canMove = false;
            this.currentTimerToStartMovingAgain = this.timerToStartMovingAgain;
            this.tryShootAtPlayer(deltaTime);
        }
        else{
            if(this.currentTimerToStartMovingAgain > 0){
                this.canMove = false;
                this.currentTimerToStartMovingAgain -= deltaTime;
                this.tryShootAtPlayer(deltaTime);
            }else{
                this.canMove = true;
            }
        }
    }
    
    
    public onCollision(type: CollisionType, other?: ICollideable): void {
        super.onCollision(type, other);

        switch(type){
            case CollisionType.Player:
                //this.currentTimerToStartMovingAgain = this.timerToStartMovingAgain; 
                //stop moving
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