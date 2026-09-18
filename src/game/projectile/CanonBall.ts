import { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { IProjectile } from "../Interfaces/IProjectile";
import type { ICollideable } from "../Interfaces/ICollideable";
import { collisionHelpers } from "../Collision/CollisionHelpers";
import { CollisionType } from "../Collision/CollisionType";

export class CanonBall extends Entity implements IProjectile, ICollideable{
    
    //collision stuff
    colliderSize: Point = new Point(15,15);
    halfSize: Point = new Point(this.colliderSize.x/2, this.colliderSize.y/2);
    center: Point = new Point(-this.colliderSize.x/2, -this.colliderSize.y/2);
    collisionLayer: CollisionType = CollisionType.Projectile;

    protected graphicSize: Point = new Point(15,15);
    speed: number = 250;
    timeout : number = 2; //secs
    currentLifetime : number = 0;

    constructor(newPosition: Point, rotation : number, size? : Point) {
        super(newPosition, rotation, size);
    
        this.setSprite(new Graphics().rect(this.center.x, this.center.y, this.colliderSize.x, this.colliderSize.y).fill(0xFFFF00));

        eventHub.trigger(GameEvents.UPDATEABLE_INSTANTIATED, this); //world will listen and update accordingly
        eventHub.trigger(GameEvents.COLLIDEABLE_INSTANTIATED, this); //Collision manager will listen and do its own thing
    }
    
    
    getCollisionPoints(): Point[] {
        return collisionHelpers.getBoxColliderPoints(this.position, this.colliderSize);
    }

    update(deltaTime: number): void {
        this.move(deltaTime, this.speed);

        this.currentLifetime += deltaTime;

        if(this.currentLifetime >= this.timeout){
            //console.log("canonball timed out")
            this.destroy();
        }
    }

    move(deltaTime : number, speed : number): void {
        this.position.x +=  speed * deltaTime * Math.sin(this.rotation);
        this.position.y += -speed * deltaTime * Math.cos(this.rotation);
    }

    destroy(){
        //console.log("canonball destroyed");
        eventHub.trigger(GameEvents.UPDATEABLE_DESPAWNED, this); //world will listen and update accordingly
        eventHub.trigger(GameEvents.COLLIDEABLE_DESPAWNED, this); //Collision manager will listen and do its own thing
    }

    onCollision(type : CollisionType, other?: ICollideable): void {
        //console.log("collision!!");
        this.destroy();
    }
}