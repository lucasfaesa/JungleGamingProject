import { Point, Graphics, DEG_TO_RAD } from "pixi.js";
import { Ship } from "../Ship/Ship";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";
import { CollisionType } from "../Collision/CollisionType";
import type { ICollideable } from "../Interfaces/ICollideable";
import { Chaser } from "../Enemy/Chaser";
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export class Player extends Ship implements IShooter {
    private frontCanon: Canon;
    private leftCanon: Canon;
    private rightCanon: Canon;

    constructor(newPosition: Point) {
        super(newPosition, 0);

        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Player; 


        //health
        this.health = 10;
        this.damage = 1;

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xff0000)
        );

        this.frontCanon = new Canon(new Point(0, -16), 0, this.damage);
        this.leftCanon = new Canon(new Point(-16, 0), -90 * DEG_TO_RAD, this.damage);
        this.rightCanon = new Canon(new Point(16, 0), 90 * DEG_TO_RAD, this.damage);

        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);
    }

    public shootSideways(rightSide: boolean): void {
        rightSide ? this.rightCanon.shoot() : this.leftCanon.shoot();
    }

    public shoot(): void {
        this.frontCanon.shoot();
    }

    public onCollision(type: CollisionType, otherCollideable: ICollideable): void {
        super.onCollision(type, otherCollideable);
        
        switch(type){
            case CollisionType.Enemy:
                this.onCollidedWithShip();
        }
    }

    onDamageTaken(damage: number): void {
        super.onDamageTaken(damage);
    }

    protected destroy(): void {
        super.destroy();
        eventHub.trigger(GameEvents.PLAYER_DIED);
    }
}