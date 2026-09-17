import type { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";

export class Player extends Entity implements IMoveable, IShooter {

    private frontCanon : Canon;
    private leftCanon : Canon;
    private rightCanon : Canon;

    moveSpeed: number = 2;
    rotationSpeed: number = 0.05;

    constructor(newPosition: Point, newSprite?: Graphics | null){
        super(newPosition, 0, newSprite);

        this.frontCanon = new Canon(this.position);
        this.leftCanon = new Canon(this.position, 90);
        this.rightCanon = new Canon(this.position, -90);

        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);
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

    public shootForward (){
        this.shoot(this.frontCanon);
    }

    public shootSideways(rightSide : boolean){
        this.shoot(rightSide ? this.rightCanon : this.leftCanon);
    }

    shoot(shooter : IShooter): void {
        shooter.shoot;
    }
}