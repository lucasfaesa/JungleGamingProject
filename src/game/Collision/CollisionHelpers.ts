import { Point } from "pixi.js";

class CollisionHelpers{

    getBoxColliderPoints(position: Point, size: Point): Point[] {
        const halfWidth = size.x / 2;
        const halfHeight = size.y / 2;

        return [
            new Point(position.x - halfWidth, position.y - halfHeight), //left upper side
            new Point(position.x + halfWidth, position.y - halfHeight), // right upper side
            new Point(position.x - halfWidth, position.y + halfHeight), // lower left side
            new Point(position.x + halfWidth, position.y + halfHeight), // lower right side
        ];
    }
}

export const collisionHelpers = new CollisionHelpers();
