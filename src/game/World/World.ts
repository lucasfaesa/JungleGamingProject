import type { Container } from "pixi.js";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { ISpawneable } from "../Interfaces/ISpawneable";

export class World{

    private stage : Container;
    private updateables : IUpdateable [] = [];

    constructor(stage : Container){
        this.stage = stage;
    }

    public update(deltaTime: number): void {
        
        for (let i = this.updateables.length - 1; i >= 0; i--) {
            this.updateables[i].update(deltaTime);
        }
    }

    public spawn(objectToSpawn : ISpawneable){
        this.stage.addChild(objectToSpawn)
        this.updateables.push(objectToSpawn);
    }

    public destroySpawned(objectToBeDestroyed : ISpawneable){
        this.stage.removeChild(objectToBeDestroyed);
        
        const index = this.updateables.indexOf(objectToBeDestroyed);
        if(index !== -1){
            this.updateables.splice(index, 1);
        }
    }

}