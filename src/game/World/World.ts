import type { Container } from "pixi.js";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { ISpawneable } from "../Interfaces/ISpawneable";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export class World{

    private stage : Container;
    private updateables : IUpdateable [] = [];

    private readonly onUpdateableInstantiated = (data?: unknown) => this.OnUpdateableInstantiated(data);
    private readonly onUpdateableDespawned    = (data?: unknown) => this.OnUpdateableDespawned(data);

    constructor(stage : Container){
        this.stage = stage;

        eventHub.subscribe(GameEvents.UPDATEABLE_INSTANTIATED, this.onUpdateableInstantiated);
        eventHub.subscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.UPDATEABLE_INSTANTIATED, this.onUpdateableInstantiated);
        eventHub.unsubscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);
    }

    public update(deltaTime: number): void {
        
        for (let i = this.updateables.length - 1; i >= 0; i--) {
            this.updateables[i].update(deltaTime);
        }
    }

    private spawnUpdateable(objectToSpawn : ISpawneable){
        this.stage.addChild(objectToSpawn)
        this.updateables.push(objectToSpawn);
    }

    private destroySpawnedUpdateable(objectToBeDestroyed : ISpawneable){
        this.stage.removeChild(objectToBeDestroyed);
        
        const index = this.updateables.indexOf(objectToBeDestroyed);
        if(index !== -1){
            this.updateables.splice(index, 1);
        }
    }

    private OnUpdateableInstantiated(data? : unknown){
        const spawneable = data as ISpawneable;
        this.spawnUpdateable(spawneable);

        console.log("Called instantiation");
    }

    private OnUpdateableDespawned(data? : unknown){
        const spawneable = data as ISpawneable;
        this.destroySpawnedUpdateable(spawneable);

        console.log("Called destruction");
    }


}