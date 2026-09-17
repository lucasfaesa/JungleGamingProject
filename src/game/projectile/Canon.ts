import { Entity } from "../Entities/Entity";
import { CanonBall } from "./CanonBall";
import type { IShooter } from "../Interfaces/IShooter";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import { Graphics, Point } from "pixi.js";

//can exist inside a ship or in the world
export class Canon extends Entity implements IShooter {

    shoot(): void {

        console.log("Canonball instantiated");

        const globalPos = this.getGlobalPosition();
        const globalRotation = Math.atan2(this.worldTransform.b, this.worldTransform.a);

        const canonBall : CanonBall = new CanonBall(new Point(globalPos.x, globalPos.y), globalRotation, new Graphics().rect(-7, -7, 15, 15).fill(0xFFFF00));

        eventHub.trigger(GameEvents.UPDATEABLE_INSTANTIATED, canonBall); //world will listen and update accordingly
    }
    
}