import { pointInTriangle, type Point } from "pixi.js";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { ICollideable } from "../Interfaces/ICollideable";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { TileMap } from "../Map/TileMap";
import { CollisionType } from "./CollisionType";

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
        this.checkForCollisionWithIslands();
        this.checkForCollisionWithOtherColliders();
    }

    private checkForCollisionWithIslands(){

        for (let i = this.collideables.length - 1; i >= 0; i--) {
            const collideable : ICollideable = this.collideables[i];

            const points : Point[] = collideable.getCollisionPoints();

            for(let j = 0; j < points.length; j++){
                if(this.tileMap.isSolidAt(points[j].x, points[j].y)){
                    collideable.onCollision(CollisionType.Island);
                    break;
                }
            }
        }
    }

    private checkForCollisionWithOtherColliders(){
        for (let i = this.collideables.length - 1; i >= 0; i--) {
            const first = this.collideables[i];

            for (let j = i - 1; j >= 0; j--) {
                const second = this.collideables[j];

                if (this.checkAABBCollision(first, second)) {
                    first.onCollision(second.collisionLayer, second);
                    second.onCollision(first.collisionLayer, first);
                }
            }
        }
    }

    
    // since positions are centered, two boxes overlap if the distance between their centers
    // along each axis is less than the sum of their half-dimensions (half-widths and half-heights).
    private checkAABBCollision(a: ICollideable, b: ICollideable): boolean {
        // Distance between centers along X and Y axes
        const dx = Math.abs(a.position.x - b.position.x);
        const dy = Math.abs(a.position.y - b.position.y);

        // Maximum allowed distance before edges stop touching
        const combinedHalfWidth = a.halfSize.x + b.halfSize.x;
        const combinedHalfHeight = a.halfSize.y + b.halfSize.y;

        // Collision occurs only if overlapping on both horizontal and vertical axes
        return dx < combinedHalfWidth && dy < combinedHalfHeight;
    }
}