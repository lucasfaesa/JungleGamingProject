import { Entity } from "../Entities/Entity";
import type { IProjectile } from "../Interfaces/IProjectile";
import type { IUpdateable } from "../Interfaces/IUpdateable";

export class CanonBall extends Entity implements IProjectile{
    
    speed: number = 5;

    update(deltaTime: number): void {
        this.move(deltaTime, this.speed);
    }

    move(deltaTime : number, speed : number): void {
        this.position.y +=  speed * deltaTime * Math.sin(this.rotation);
        this.position.x +=  speed * deltaTime * Math.cos(this.rotation);
    }
}