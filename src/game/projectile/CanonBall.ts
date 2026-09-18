import { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { IProjectile } from "../Interfaces/IProjectile";
import type { ICollideable } from "../Interfaces/ICollideable";
import { collisionHelpers } from "../Collision/CollisionHelpers";

export class CanonBall extends Entity implements IProjectile, ICollideable{
    
    //collision stuff
    size: Point = new Point(15,15);
    halfSize: Point = new Point(this.size.x/2, this.size.y/2);
    center: Point = new Point(-this.size.x/2, -this.size.y/2);

    speed: number = 5;
    timeout : number = 2000; //ms

    constructor(newPosition: Point, rotation : number, newSprite?: Graphics | null) {
        super(newPosition, rotation, newSprite);
    
        this.setSprite(new Graphics().rect(this.center.x, this.center.y, this.size.x, this.size.y).fill(0xFFFF00));

        setTimeout(() => {
            this.destroy();
        }, this.timeout);

        eventHub.trigger(GameEvents.UPDATEABLE_INSTANTIATED, this); //world will listen and update accordingly
        eventHub.trigger(GameEvents.COLLIDEABLE_INSTANTIATED, this); //Collision manager will listen and do its own thing
    }
    
    getCollisionPoints(): Point[] {
        return collisionHelpers.getBoxColliderPoints(this.position, this.size);
    }

    update(deltaTime: number): void {
        this.move(deltaTime, this.speed);
    }

    move(deltaTime : number, speed : number): void {
        this.position.x +=  speed * deltaTime * Math.sin(this.rotation);
        this.position.y += -speed * deltaTime * Math.cos(this.rotation);
    }

    destroy(){
        console.log("canonball timed out");
        eventHub.trigger(GameEvents.UPDATEABLE_DESPAWNED, this); //world will listen and update accordingly
        eventHub.trigger(GameEvents.COLLIDEABLE_DESPAWNED, this); //Collision manager will listen and do its own thing
    }

    onCollision(other?: ICollideable): void {
        console.log("collision!!");
        this.destroy();
    }
}