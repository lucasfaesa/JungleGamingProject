import { Point, Graphics, DEG_TO_RAD } from "pixi.js";
import { Ship } from "../Ship/Ship";
import { Canon } from "../projectile/Canon";
import type { IShooter } from "../Interfaces/IShooter";
import { CollisionType } from "../Collision/CollisionType";

export class Player extends Ship implements IShooter {
    private frontCanon: Canon;
    private leftCanon: Canon;
    private rightCanon: Canon;

    constructor(newPosition: Point) {
        super(newPosition, 0);

        this.moveSpeed = 120;
        this.rotationSpeed = 3;
        this.collisionLayer = CollisionType.Player; 

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xff0000)
        );

        this.frontCanon = new Canon(new Point(0, -16), 0);
        this.leftCanon = new Canon(new Point(-16, 0), -90 * DEG_TO_RAD);
        this.rightCanon = new Canon(new Point(16, 0), 90 * DEG_TO_RAD);

        this.addChild(this.frontCanon);
        this.addChild(this.leftCanon);
        this.addChild(this.rightCanon);
    }

    public shootForward(): void {
        this.frontCanon.shoot();
    }

    public shootSideways(rightSide: boolean): void {
        rightSide ? this.rightCanon.shoot() : this.leftCanon.shoot();
    }

    public shoot(): void {
        this.shootForward(); //redundant, yeah...
    }
}