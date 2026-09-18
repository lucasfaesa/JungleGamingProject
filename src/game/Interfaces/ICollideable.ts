import type { Point } from "pixi.js";

export interface ICollideable{
    position: Point;
    size : Point;
    halfSize : Point;
    center: Point;

    getCollisionPoints(): Point[];
    onCollision(other?: ICollideable) : void;
}