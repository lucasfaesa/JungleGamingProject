import { Point, Graphics, DEG_TO_RAD } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";
import type { ISpawneable } from "../Interfaces/ISpawneable";
import type { ICollideable } from "../Interfaces/ICollideable";
import { CollisionType } from "../Collision/CollisionType";
import { collisionHelpers } from "../Collision/CollisionHelpers";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export class Player extends Entity implements IMoveable, IShooter, ISpawneable, ICollideable{

    private frontCanon : Canon;
    private leftCanon : Canon;
    private rightCanon : Canon;

    protected graphicSize: Point = new Point(50,50);
    moveSpeed: number = 120;
    rotationSpeed: number = 3;

    //collision
    colliderSize: Point = new Point(50, 50);
    halfSize: Point = new Point(this.colliderSize.x/2, this.colliderSize.y/2);
    center: Point = new Point(this.colliderSize.x/2, this.colliderSize.y/2);

    //movement with collision
    private previousPosition : Point = new Point();
    private previousRotation : number = 0;

    constructor(newPosition: Point) {
        super(newPosition, 0);

        this.setSprite(new Graphics().rect(-this.graphicSize.x/2, -this.graphicSize.y/2, this.graphicSize.x, this.graphicSize.y).fill(0xFF0000));

        this.frontCanon = new Canon(new Point(0,-16), 0);
        this.leftCanon = new Canon(new Point(-16,0), -90 * DEG_TO_RAD);
        this.rightCanon = new Canon(new Point(16,0), 90 * DEG_TO_RAD);

        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);

        eventHub.trigger(GameEvents.COLLIDEABLE_INSTANTIATED, this);
    }
    
    getCollisionPoints(): Point[] {
        return collisionHelpers.getBoxColliderPoints(this.position, this.colliderSize);
    }

    onCollision(type: CollisionType, other?: ICollideable): void {
        switch(type){
            case CollisionType.Island:
                this.onCollidedWithIsland();
                break;
        }
    }
    
    private onCollidedWithIsland(){

        console.log("Player collided with island");

        this.position.copyFrom(this.previousPosition);
        this.rotation = this.previousRotation;
    }

    update(deltaTime: number): void {
        //nothing yet
    }

    moveVertical(deltaTime: number, negativeInput: boolean): void {
        
        //saving previous pos in case a collision happens
        this.previousPosition.copyFrom(this.position);

        const direction : number = negativeInput ? -1 : 1;

        this.position.x +=  direction * this.moveSpeed * deltaTime * Math.sin(this.rotation);
        this.position.y += -direction * this.moveSpeed * deltaTime * Math.cos(this.rotation);
    }
    
    rotate(deltaTime: number, negativeInput: boolean): void {
        
        //saving previous rotation case collision happens
        this.previousRotation = this.rotation;

        const side : number = negativeInput ? -1 : 1;

        this.rotation += side * this.rotationSpeed * deltaTime;
    }

    public shootForward (){
        console.log("shooting forward")
        this.frontCanon.shoot();
    }

    public shootSideways(rightSide : boolean){
        console.log("shooting sidewats")
        rightSide ? this.rightCanon.shoot() : this.leftCanon.shoot();
    }

    shoot(): void {
        
    }
    
}