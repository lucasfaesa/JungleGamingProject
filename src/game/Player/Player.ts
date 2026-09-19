import { Point, Graphics, DEG_TO_RAD, Sprite } from "pixi.js";
import { Ship } from "../Ship/Ship";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import { InterfaceHelper } from "../Interfaces/InterfaceHelper";

export class Player extends Ship implements IShooter {
    private frontCanon: Canon;
    private leftCanon: Canon;
    private rightCanon: Canon;

    constructor(newPosition: Point) {
        super(newPosition, 0);

        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Player; 
        this.ignoredCollisionLayers = [CollisionType.Player, CollisionType.PlayerProjectile];
        
        //health
        this.initializeHealth(10);
        this.damage = 1;

        //sprite
        this.setSpriteByName("playerShip");

        const projectileCollisionsToIgnore: CollisionType[] = [  CollisionType.Player,  CollisionType.PlayerProjectile];

        this.frontCanon = new Canon(new Point(0, -50), 0, this.damage, CollisionType.PlayerProjectile, projectileCollisionsToIgnore);
        this.leftCanon = new Canon(new Point(-16, -20), -90 * DEG_TO_RAD, this.damage, CollisionType.PlayerProjectile, projectileCollisionsToIgnore);
        this.rightCanon = new Canon(new Point(16, -20), 90 * DEG_TO_RAD, this.damage, CollisionType.PlayerProjectile, projectileCollisionsToIgnore);

        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);
    }

    public shootSideways(rightSide: boolean): void {
        rightSide ? this.rightCanon.shoot() : this.leftCanon.shoot();
    }

    public shoot(): void {
        this.frontCanon.shoot();
    }

    public onCollision(type: CollisionType, otherCollideable: ICollideable): void {
        super.onCollision(type, otherCollideable);
        
        switch(type){
            case CollisionType.Enemy:
                this.onCollidedWithShip();
            break;
            case CollisionType.EnemyProjectile:
            console.log("received damage from enemy projectile");

            if(InterfaceHelper.isDamageDealer(otherCollideable)){ //checking if other collideble implements IdamageDealer
                this.onDamageTaken(otherCollideable.damage);
            }
            break;
        }
    }

    onDamageTaken(damage: number): void {
        super.onDamageTaken(damage);
    }

    public destroy(): void {
        super.destroy();
        eventHub.trigger(GameEvents.PLAYER_DIED);
    }
}
