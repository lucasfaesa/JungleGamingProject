import type { Point } from "pixi.js";

export interface ICollideable{
    position: Point;
    onCollision(other?: ICollideable) : void;
}