import type { Container, Point } from "pixi.js";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { ISpawneable } from "../Interfaces/ISpawneable";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import { Player } from "../Player/Player";
import { TileMap } from "../Map/TileMap";
import { TilemapData } from "../Map/TilemapData";
import { CollisionManager } from "../Collision/CollisionManager";

//controls anything related to the world
export class World{

    private stage : Container;
    private updateables : IUpdateable [] = [];
    private tileMap! : TileMap;
    private collisionManager! : CollisionManager;

    private readonly onUpdateableInstantiated = (data?: unknown) => this.OnUpdateableInstantiated(data);
    private readonly onUpdateableDespawned    = (data?: unknown) => this.OnUpdateableDespawned(data);

    constructor(stage : Container){
        this.stage = stage;

        this.generateTiles();
        this.activateCollisions();

        eventHub.subscribe(GameEvents.UPDATEABLE_INSTANTIATED, this.onUpdateableInstantiated);
        eventHub.subscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.UPDATEABLE_INSTANTIATED, this.onUpdateableInstantiated);
        eventHub.unsubscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);

        this.collisionManager?.destroy();
    }

    public update(deltaTime: number): void {
        
        for (let i = this.updateables.length - 1; i >= 0; i--) {
            this.updateables[i].update(deltaTime);
        }

    }

    public spawnPlayer(position : Point) : Player {
        const player = new Player(position);
        this.spawnUpdateable(player);
        return player;
    }

    private generateTiles(){
        const tilemapData: TilemapData = new TilemapData();
        this.tileMap = new TileMap(tilemapData);
        this.stage.addChild(this.tileMap);
    }

    private activateCollisions(){
        this.collisionManager = new CollisionManager(this.tileMap);
        this.updateables.push(this.collisionManager);
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
    }

    private OnUpdateableDespawned(data? : unknown){
        const spawneable = data as ISpawneable;
        this.destroySpawnedUpdateable(spawneable);
    }


}