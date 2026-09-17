import type { Graphics, Point } from "pixi.js";
import { Entity } from "../Entities/Entity";

export class Player extends Entity{


    constructor(newPosition: Point, newSprite?: Graphics | null){
        super(newPosition, newSprite);
    }

}