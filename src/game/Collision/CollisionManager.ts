import type { Point } from "pixi.js";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { ICollideable } from "../Interfaces/ICollideable";
import type { IUpdateable } from "../Interfaces/IUpdateable";
import type { TileMap } from "../Map/TileMap";
import { CollisionType } from "./CollisionType";

export class CollisionManager implements IUpdateable {
    
    private tileMap : TileMap;
    private collideables : ICollideable [] = [];
    private pendingRemovals = new Set<ICollideable>();

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

        //console.log("Collideable Instantiated");
    }

    public OnCollideableDespawned(data? : unknown){
        const collideable = data as ICollideable;

        this.pendingRemovals.add(collideable);
       // console.log("Collideable Despawned");
    }

    public update() {
        this.checkForCollisionWithIslands();
        this.checkForCollisionWithOtherColliders();

        this.checkForPendingRemovals();
    }

    private checkForCollisionWithIslands(){

        for (let i = this.collideables.length - 1; i >= 0; i--) {
            const collideable : ICollideable = this.collideables[i];
            if (this.pendingRemovals.has(collideable)) continue;

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
                if (this.pendingRemovals.has(first)) //if this is a pending object to be removed, we leave
                    break;

                const second = this.collideables[j];
                if (this.pendingRemovals.has(second))  //if this is a pending object to be remove, we skip
                    continue;

                //skipping calculations if the first collider ignores the second collider layer and vice-versa
                if (first.ignoredCollisionLayers?.includes(second.collisionLayer) || second.ignoredCollisionLayers?.includes(first.collisionLayer)) {
                    continue;
                }

                //check collisions
                if (this.checkAABBCollision(first, second)) {
                    first.onCollision(second.collisionLayer, second);
                    second.onCollision(first.collisionLayer, first);
                }
            }
        }
    }

    //when removing stuff from a list that was iterating (checkForCollisionWithOtherColliders)
    //could mess up with the indexes, even if we were iterating backwards, so now we wait and ignore
    //them until the processing was finished, so we remove from the list
    private checkForPendingRemovals(){
        
        if (this.pendingRemovals.size > 0) {
            this.collideables = this.collideables.filter(collideable => !this.pendingRemovals.has(collideable));
            this.pendingRemovals.clear();
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
