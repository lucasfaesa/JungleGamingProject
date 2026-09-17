import { Point } from "pixi.js";
import type { IMoveable } from "../Interfaces/IMoveable";
import { Player } from "../Player/Player"
import { InputManager } from "../input/InputManager";

export class PlayerController implements IMoveable {

    public player : Player;
    private moveSpeed: number = 2;
    private rotationSpeed: number = 0.1;
    private inputManager : InputManager;

    constructor(player : Player, inputManager : InputManager){
        this.player = player;
        this.inputManager = inputManager;
    }

    public update(deltaTime : number) : void{
                
        if(this.inputManager.actionsMap.forward)
            this.moveVertical(deltaTime, false);
        if(this.inputManager.actionsMap.backwards)
            this.moveVertical(deltaTime, true);
        if(this.inputManager.actionsMap.rotateRight)
            this.rotate(deltaTime, false);
        if(this.inputManager.actionsMap.rotateLeft)
            this.rotate(deltaTime, true);

    }

    moveVertical(deltaTime: number, negativeInput: boolean): void {
        
        const direction : number = negativeInput ? -1 : 1;

        this.player.position.y -= direction * this.moveSpeed * deltaTime;
    }
    
    rotate(deltaTime: number, negativeInput: boolean): void {
        
        const side : number = negativeInput ? -1 : 1;

        this.player.rotation += side * this.rotationSpeed * deltaTime;
    }
    
}