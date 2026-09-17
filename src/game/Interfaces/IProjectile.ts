import type { IUpdateable } from "./IUpdateable";

export interface IProjectile extends IUpdateable{
    speed : number;

    update(deltaTime : number) :void ;
    move(deltaTime : number, speed : number) : void;

}