import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { ICollideable } from "../Interfaces/ICollideable";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { TileMap } from "../Map/TileMap";

export class CollisionManager implements IUpdateable {
    
    private tileMap : TileMap;
    private collideables : ICollideable [] = [];

    private readonly onCollideableInstantiated = (data?: unknown) => this.OnCollideableInstantiated(data);
    private readonly onCollideableDespawned    = (data?: unknown) => this.OnCollideableDespawned(data);

    constructor(tileMap : TileMap){
        this.tileMap = tileMap;

        eventHub.subscribe(GameEvents.COLLIDEABLE_INSTANTIATED, this.onCollideableInstantiated);
        eventHub.subscribe(GameEvents.COLLIDEABLE_DESPAWNED, this.onCollideableDespawned);
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.COLLIDEABLE_INSTANTIATED, this.onCollideableInstantiated);
        eventHub.unsubscribe(GameEvents.COLLIDEABLE_DESPAWNED, this.onCollideableDespawned);
    }

    public OnCollideableInstantiated(data? : unknown){
        const collideable = data as ICollideable;
        this.collideables.push(collideable);

        console.log("Collideable Instantiated");
    }

    public OnCollideableDespawned(data? : unknown){
        const collideable = data as ICollideable;

        const index = this.collideables.indexOf(collideable);
        if(index !== -1){
            this.collideables.splice(index, 1);
        }

        console.log("Collideable Despawned");
    }

    public update() {
        for (let i = this.collideables.length - 1; i >= 0; i--) {
            if(this.tileMap.isSolidAt(this.collideables[i].position.x, this.collideables[i].position.y)){
                this.collideables[i].onCollision();
            }
        }
    }
}