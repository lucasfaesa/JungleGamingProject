import type { Point } from "pixi.js";
import type { ICollideable } from "./ICollideable";

export interface ISquareCollider extends ICollideable{
    size : Point;
}