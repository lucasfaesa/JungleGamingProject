import type { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { IProjectile } from "../Interfaces/IProjectile";

export class CanonBall extends Entity implements IProjectile{
    
    speed: number = 5;
    timeout : number = 2000; //ms

    constructor(newPosition: Point, rotation : number, newSprite?: Graphics | null) {
        super(newPosition, rotation, newSprite);
    
        setTimeout(() => {
            this.destroy();
        }, this.timeout);
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
    }
}