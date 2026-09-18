import type { Point } from "pixi.js";
import type { CollisionType } from "../Collision/CollisionType";

export interface ICollideable{
    position: Point;
    colliderSize : Point;
    halfSize : Point;
    center: Point;
    collisionLayer : CollisionType;

    getCollisionPoints(): Point[];
    onCollision(type: CollisionType, otherCollideable?: ICollideable) : void;
}