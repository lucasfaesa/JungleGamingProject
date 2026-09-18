import { Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";
import type { ISpawneable } from "../Interfaces/ISpawneable";
import type { ICollideable } from "../Interfaces/ICollideable";
import { CollisionType } from "../Collision/CollisionType";
import { collisionHelpers } from "../Collision/CollisionHelpers";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export abstract class Ship extends Entity implements IMoveable, ISpawneable, ICollideable {
    
    protected graphicSize: Point = new Point(50, 50);
    public moveSpeed: number = 100;
    public rotationSpeed: number = 2.5;

    //collider stuff
    public colliderSize: Point = new Point(50, 50);
    protected halfSize: Point = new Point(this.colliderSize.x/2, this.colliderSize.y/2,);
    protected center: Point = new Point(-this.colliderSize.x/2, -this.colliderSize.y/2);
    protected previousPosition: Point = new Point();
    protected previousRotation: number = 0;

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

    public onCollision(type: CollisionType, other?: ICollideable): void {
        switch (type) {
            case CollisionType.Island:
                this.onCollidedWithIsland();
                break;
        }
    }

    protected onCollidedWithIsland(): void {
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

    public destroy(): void {
        eventHub.trigger(GameEvents.COLLIDEABLE_DESPAWNED, this);
        eventHub.trigger(GameEvents.UPDATEABLE_DESPAWNED, this);
    }
}