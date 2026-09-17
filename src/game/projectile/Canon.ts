import { Entity } from "../Entities/Entity";
import { CanonBall } from "./CanonBall";
import type { IShooter } from "../Interfaces/IShooter";

export class Canon extends Entity implements IShooter {


    shoot(shooter : IShooter): void {

        const canonBall : CanonBall = new CanonBall(this.position);
        
        
    }
    
}