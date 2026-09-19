import { type Point } from "pixi.js";
import { Ship } from "../Ship/Ship";
import type { Player } from "../Player/Player";
import type { TilemapData } from "../Map/TilemapData";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export abstract class EnemyShip extends Ship {

    protected targetPlayer: Player;

    private tilemapData: TilemapData;

    protected canTurn : boolean = true;
    protected canMove : boolean = true;

    // Radius (in tiles) around the enemy that generates repulsion
    protected readonly repulsionRadius: number = 1;
    // How strongly repulsion weighs against attraction to the player
    private readonly repulsionStrength: number = 6000;

    constructor(newPosition: Point, player: Player, tilemapData: TilemapData) {
        super(newPosition, 0);

        this.targetPlayer = player;
        this.tilemapData = tilemapData;
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);

        if(!this.targetPlayer.isAlive)
            return;

        const steeringAngle = this.computeSteeringAngle();

        // repulsion only matters while navigating; when stopped, aim straight at the player
        if(this.canTurn){
            this.faceDirection(this.canMove ? steeringAngle : this.getAngleToPlayer(), deltaTime);
        }

        // never thrust while pointing away from where steering wants to go, or it rams the island
        if(this.canMove && Math.abs(this.angleDiff(steeringAngle)) < Math.PI / 2)
            this.moveVertical(deltaTime, false);
    }

    //calculates the correct angle based on player attraction + repulsion of islands
    //the closer to the island, more it wants to turn away from it
    private computeSteeringAngle(): number {

        // attraction force: normalized vector pointing toward the player
        const dx = this.targetPlayer.position.x - this.position.x;
        const dy = this.targetPlayer.position.y - this.position.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy) || 1;

        let forceX = dx / distToPlayer;
        let forceY = dy / distToPlayer;

        // repulsion force: sum vectors away from each nearby island tile
        const tileW = this.tilemapData.tile_width;
        const tileH = this.tilemapData.tile_height;

        const myCol = Math.floor(this.position.x / tileW);
        const myRow = Math.floor(this.position.y / tileH);

        for (let row = myRow - this.repulsionRadius; row <= myRow + this.repulsionRadius; row++) {
            for (let col = myCol - this.repulsionRadius; col <= myCol + this.repulsionRadius; col++) {
                const tile = this.tilemapData.getTileAt(col, row);
                if (tile === null || tile === 0) 
                    continue; // island tiles only

                // Center of the tile in world pixels
                const tileCx = (col + 0.5) * tileW;
                const tileCy = (row + 0.5) * tileH;

                const repX = this.position.x - tileCx;
                const repY = this.position.y - tileCy;
                const distSq = repX * repX + repY * repY || 1;
                const dist = Math.sqrt(distSq);

                // Repulsion scales with 1/dist² and is normalized by distance
                const strength = this.repulsionStrength / distSq;
                forceX += (repX / dist) * strength;
                forceY += (repY / dist) * strength;
            }
        }

        // Convert the resulting force vector into an angle
        return Math.atan2(forceX, -forceY);
    }

    protected onCollidedWithIsland(): void {
        //enemy ships avoid island but dont collide anymore, much better, avoids some annoying things
    }

    // shortest signed rotation from current heading to targetAngle
    protected angleDiff(targetAngle: number): number {
        let diff = targetAngle - this.rotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return diff;
    }

    // turn slowly in direction of target, chooses which is best, to turn right or left
    protected faceDirection(targetAngle: number, deltaTime: number): void {
        const diff = this.angleDiff(targetAngle);

        if (Math.abs(diff) < 0.02) return;

        this.rotate(deltaTime, diff < 0);
    }

    protected getAngleToPlayer(): number {
        const dx = this.targetPlayer.position.x - this.position.x;
        const dy = this.targetPlayer.position.y - this.position.y;
        return Math.atan2(dx, -dy);
    }

    protected getDistanceToPlayer() : number {
        const dx = this.targetPlayer.position.x - this.position.x;
        const dy = this.targetPlayer.position.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy) || 1;
    }

    public killedByPlayer: boolean = false;

    public override onDamageTaken(damage: number): void {
        // If this hit is lethal, mark it as killed by the player before destroy() is called
        if (this.health - damage <= 0) {
            this.killedByPlayer = true;
        }
        super.onDamageTaken(damage);
    }

    public override destroy(): void {
        if (this.killedByPlayer) {
            eventHub.trigger(GameEvents.ENEMY_DIED, this);
        }
        super.destroy();
    }
}