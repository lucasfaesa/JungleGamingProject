import type { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";

export class Player extends Entity implements IMoveable {

    moveSpeed: number = 2;
    rotationSpeed: number = 0.05;

    constructor(newPosition: Point, newSprite?: Graphics | null){
        super(newPosition, newSprite);
    }

    moveVertical(deltaTime: number, negativeInput: boolean): void {
        
        const direction : number = negativeInput ? -1 : 1;

        this.position.y +=  direction * this.moveSpeed * deltaTime * Math.sin(this.rotation);
        this.position.x +=  direction * this.moveSpeed * deltaTime * Math.cos(this.rotation);
    }
    
    rotate(deltaTime: number, negativeInput: boolean): void {
        
        const side : number = negativeInput ? -1 : 1;

        this.rotation += side * this.rotationSpeed * deltaTime;
    }
}