import { Entity } from "../Entities/Entity";
import { CanonBall } from "./CanonBall";
import type { IShooter } from "../Interfaces/IShooter";
import { Graphics, Point } from "pixi.js";
import type { IDamageDealer } from "../Interfaces/IDamageDealer";

//can exist inside a ship or in the world
export class Canon extends Entity implements IShooter, IDamageDealer {

    protected graphicSize: Point = new Point(15,15);
    
    damage: number;

    constructor(newPosition: Point, rotation : number = 0, damage : number, size? : Point){
        super(newPosition, rotation, size);

        this.damage = damage;

        this.setSprite(new Graphics().rect(-this.graphicSize.x/2, -this.graphicSize.y/2, this.graphicSize.x, this.graphicSize.y).fill(0xA000FF));
    }

    shoot(): void {

        //console.log("Canonball instantiated");

        const globalPos = this.getGlobalPosition();
        const globalRotation = Math.atan2(this.worldTransform.b, this.worldTransform.a);

        const spawnOffset : number = 30;

        const spawnPosX = globalPos.x + spawnOffset * Math.sin(globalRotation);
        const spawnPosY = globalPos.y - spawnOffset * Math.cos(globalRotation);


        const canonBall : CanonBall = new CanonBall(new Point(spawnPosX, spawnPosY), globalRotation, this.damage);
    }
    
}