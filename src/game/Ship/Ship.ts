import { Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";
import type { ISpawneable } from "../Interfaces/ISpawneable";
import type { ICollideable } from "../Interfaces/ICollideable";
import { CollisionType } from "../Collision/CollisionType";
import { collisionHelpers } from "../Collision/CollisionHelpers";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { IDamageable } from "../Interfaces/IDamageable";
import type { IDamageDealer } from "../Interfaces/IDamageDealer";
import { CanonBall } from "../projectile/CanonBall";
import { InterfaceHelper } from "../Interfaces/InterfaceHelper";

export abstract class Ship extends Entity implements IMoveable, ISpawneable, ICollideable, IDamageable, IDamageDealer{
    
    protected graphicSize: Point = new Point(50, 50);
    public moveSpeed: number = 100;
    public rotationSpeed: number = 2.5;

    //collider stuff
    public colliderSize: Point = new Point(50, 50);
    public halfSize: Point = new Point(this.colliderSize.x/2, this.colliderSize.y/2,);
    public center: Point = new Point(-this.colliderSize.x/2, -this.colliderSize.y/2);
    public collisionLayer: CollisionType = CollisionType.DEFAULT;
    
    protected previousPosition: Point = new Point();
    protected previousRotation: number = 0;
    
    //health
    health: number = 10;
    isAlive: boolean = true;
    //damage
    damage: number = 1;

    constructor(newPosition: Point, rotation: number = 0) {
        super(newPosition, rotation);
        this.previousPosition.copyFrom(newPosition);
        this.previousRotation = rotation;

        // Register to collision system
        eventHub.trigger(GameEvents.COLLIDEABLE_INSTANTIATED, this);
        eventHub.trigger(GameEvents.UPDATEABLE_INSTANTIATED, this);
    }    
    
    public getCollisionPoints(): Point[] {
        return collisionHelpers.getBoxColliderPoints(this.position, this.colliderSize);
    }

    public onCollision(type: CollisionType, otherCollideable : ICollideable): void {
        switch (type) {
            case CollisionType.Island:
                this.onCollidedWithIsland();
                break;
            case CollisionType.Projectile:
                console.log("projectile collision with ship, other collideable:");

                if(InterfaceHelper.isDamageDealer(otherCollideable)){ //checking if other collideble implements IdamageDealer
                    this.onDamageTaken(otherCollideable.damage);
                }
                break;
        }
    }

    protected onCollidedWithIsland(){
        this.rollbackMovement();
    }

    protected onCollidedWithShip(){
        this.rollbackMovement();
    }

    private rollbackMovement(){
        // rollback to last safe frame position
        this.position.copyFrom(this.previousPosition);
        this.rotation = this.previousRotation;
    }

    public moveVertical(deltaTime: number, negativeInput: boolean): void {
        this.previousPosition.copyFrom(this.position);

        const direction: number = negativeInput ? -1 : 1;
        this.position.x += direction * this.moveSpeed * deltaTime * Math.sin(this.rotation);
        this.position.y += -direction * this.moveSpeed * deltaTime * Math.cos(this.rotation);
    }

    public rotate(deltaTime: number, negativeInput: boolean): void {
        this.previousRotation = this.rotation;

        const side: number = negativeInput ? -1 : 1;
        this.rotation += side * this.rotationSpeed * deltaTime;
    }

    public update(deltaTime: number): void {
        // To be implemented on child classes
    }

    onDamageTaken(damage: number): void {
        this.health -= damage;

        console.log("Damage taken, current health: " + this.health);

        if(this.health <= 0){
            this.health = 0;
            this.isAlive = false;
            this.destroy();
        }
    }

    public destroy(): void {
        eventHub.trigger(GameEvents.COLLIDEABLE_DESPAWNED, this);
        eventHub.trigger(GameEvents.UPDATEABLE_DESPAWNED, this);
        eventHub.trigger(GameEvents.PLAYER_DIED);
    }
}