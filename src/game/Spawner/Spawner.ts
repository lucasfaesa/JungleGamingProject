import { Point } from "pixi.js";
import { Chaser } from "../Enemy/Chaser";
import type { EnemyShip } from "../Enemy/EnemyShip";
import { Shooter } from "../Enemy/Shooter";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import { GameState } from "../GameFlow/GameManager";
import type { Player } from "../Player/Player";
import type { TilemapData } from "../Map/TilemapData";
import type { TileMap } from "../Map/TileMap";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import { RandomHelper } from "../Helpers/RandomHelper";

export class Spawner implements IUpdateable {
    
    private readonly spawnDelay = 6;
    private readonly chaserSpawnChance = 4;
    private readonly maxSpawnChances = 10;
    private readonly maxEnemiesAtSameTime = 6;

    private canSpawnEnemies : boolean = false;
    private currentSpawnDelay : number = this.spawnDelay;
    private currentSpawnedEnemies : EnemyShip[] = [];

    private targetPlayer : Player;
    private tileMapData : TilemapData;
    private tilemap : TileMap;

    private readonly onGameStateChanged = (data?: unknown) => this.OnGameStateChanged(data);
    private readonly onUpdateableDespawned = (data?: unknown) => this.OnUpdateableDespawned(data);
    
    constructor(player : Player, tilemapData : TilemapData, tilemap : TileMap){
        eventHub.subscribe(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged);
        eventHub.subscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);

        this.targetPlayer = player;
        this.tileMapData = tilemapData;
        this.tilemap = tilemap;
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged);
        eventHub.unsubscribe(GameEvents.UPDATEABLE_DESPAWNED, this.onUpdateableDespawned);
    }

    private OnGameStateChanged (data?: unknown){

        const gameState = data as GameState;

        if (gameState === GameState.Playing) {
            const position : Point | null = this.tryGetRandomSpawnPosition();

            if(position !== null){
                this.spawnRandomEnemy(position);
            }
            this.canSpawnEnemies = true;
        }
        if(gameState === GameState.Loss || gameState === GameState.Victory){
            this.canSpawnEnemies = false;
            this.destroyAllEnemies();
        }
    };

    public update(deltaTime : number){
        
        if(!this.canSpawnEnemies)
            return;

        this.currentSpawnDelay -= deltaTime;

        if(this.currentSpawnDelay <= 0){
            this.currentSpawnDelay = this.spawnDelay;

            if(this.currentSpawnedEnemies.length < this.maxEnemiesAtSameTime){
                const position : Point | null = this.tryGetRandomSpawnPosition();

                if(position !== null){
                    this.spawnRandomEnemy(position);
                }
            }
            
        }
    }

    private spawnRandomEnemy(position : Point){
        const randomNumber : number = RandomHelper.randomInt(0, this.maxSpawnChances);
        
        let enemy : EnemyShip;

        if(randomNumber <= this.chaserSpawnChance){
            enemy = new Chaser(position, this.targetPlayer, this.tileMapData);
        }
        else{
            enemy = new Shooter(position, this.targetPlayer, this.tileMapData, this.tilemap);
        }

        this.currentSpawnedEnemies.push(enemy);
    }

    //removing enemies from list when they are destroyed
    private OnUpdateableDespawned (data?: unknown) {
        const enemy = data as EnemyShip;
        const index = this.currentSpawnedEnemies.indexOf(enemy);
        if (index !== -1) {
            console.log("Removing enemy from list");
            this.currentSpawnedEnemies.splice(index, 1);
        }
    };


    private tryGetRandomSpawnPosition() : Point | null{

        const minDistanceToPlayer = 300;
        let foundSpot = false;
        let tries : number = 0;
        const maxTries : number = 30;

        while(!foundSpot || tries < maxTries){
            tries++;

            //random row and column
            const col = Math.floor(Math.random() * this.tileMapData.columns);
            const row = Math.floor(Math.random() * this.tileMapData.rows);

            // center of tile
            const x = (col + 0.5) * this.tileMapData.tile_width;
            const y = (row + 0.5) * this.tileMapData.tile_height;

            // check if water, if not try again
            if (this.tilemap.isSolidAt(x, y)) 
                continue;

            // check if player is far
            const dx = x - this.targetPlayer.position.x;
            const dy = y - this.targetPlayer.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist >= minDistanceToPlayer) {
                foundSpot = true;
                return new Point(x, y); 
            }
        }

        return null;
    }

    private destroyAllEnemies(){

        while (this.currentSpawnedEnemies.length > 0) {
            const enemy = this.currentSpawnedEnemies.pop();
            enemy?.destroy();
        }

    }
}