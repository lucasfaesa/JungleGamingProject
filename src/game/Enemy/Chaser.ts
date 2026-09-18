import { Graphics, type Point } from "pixi.js";
import { Ship } from "../Ship/Ship";
import type { Player } from "../Player/Player";

export class Chaser extends Ship {

    targetPlayer : Player;

    constructor(newPosition: Point, player : Player) {
        super(newPosition, 0);
    
        this.targetPlayer = player;

        this.moveSpeed = 100;
        this.rotationSpeed = 3;

        this.setSprite(
            new Graphics()
                .rect(-this.graphicSize.x / 2, -this.graphicSize.y / 2, this.graphicSize.x, this.graphicSize.y)
                .fill(0xFFFF00)
        );

        console.log("Chaser Spawned");
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);

        this.followPlayer(deltaTime);
    }

    //rotate towards player and follows move towards it
    private followPlayer(deltaTime : number){
        const dx : number = this.targetPlayer.position.x - this.position.x;
        const dy : number = this.targetPlayer.position.y - this.position.y;

        const targetAngle = Math.atan2(dx, -dy);

        this.rotation = targetAngle;
        this.moveVertical(deltaTime, false);
    }
}