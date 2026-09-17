import type { ISpawneable } from "./ISpawneable";
import type { IUpdateable } from "./IUpdateable";

export interface IProjectile extends IUpdateable, ISpawneable{
    speed : number;

    update(deltaTime : number) :void ;
    move(deltaTime : number, speed : number) : void;

}