import { Point, Graphics, DEG_TO_RAD } from "pixi.js";
import { Entity } from "../Entities/Entity";
import type { IMoveable } from "../Interfaces/IMoveable";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";
import type { ISpawneable } from "../Interfaces/ISpawneable";

export class Player extends Entity implements IMoveable, IShooter, ISpawneable{

    private frontCanon : Canon;
    private leftCanon : Canon;
    private rightCanon : Canon;

    moveSpeed: number = 2;
    rotationSpeed: number = 0.05;

    constructor(newPosition: Point, newSprite?: Graphics | null) {
        super(newPosition, 0, newSprite);
        
    
        this.frontCanon = new Canon(new Point(0,-16), 0, new Graphics().rect(-7, -7, 15, 15).fill(0xA000FF));
        this.leftCanon = new Canon(new Point(-16,0), -90 * DEG_TO_RAD, new Graphics().rect(-7, -7, 15, 15).fill(0x0000FF));
        this.rightCanon = new Canon(new Point(16,0), 90 * DEG_TO_RAD, new Graphics().rect(-7, -7, 15, 15).fill(0x00FFFF));


        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);
    }
    
    update(deltaTime: number): void {
        //nothing yet
    }

    moveVertical(deltaTime: number, negativeInput: boolean): void {
        
        const direction : number = negativeInput ? -1 : 1;

        this.position.x +=  direction * this.moveSpeed * deltaTime * Math.sin(this.rotation);
        this.position.y += -direction * this.moveSpeed * deltaTime * Math.cos(this.rotation);
    }
    
    rotate(deltaTime: number, negativeInput: boolean): void {
        
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