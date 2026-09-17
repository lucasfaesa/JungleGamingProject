
import { Player } from "../Player/Player"
import { InputManager } from "../input/InputManager";

export class PlayerController {

    public player : Player;
    private moveSpeed: number = 2;
    private rotationSpeed: number = 0.05;
    private inputManager : InputManager;

    constructor(player : Player, inputManager : InputManager){
        this.player = player;
        this.inputManager = inputManager;
    }

    public update(deltaTime : number) : void{
                
        if(this.inputManager.actionsMap.forward)
            this.player.moveVertical(deltaTime, false);
        if(this.inputManager.actionsMap.backwards)
            this.player.moveVertical(deltaTime, true);
        if(this.inputManager.actionsMap.rotateRight)
            this.player.rotate(deltaTime, false);
        if(this.inputManager.actionsMap.rotateLeft)
            this.player.rotate(deltaTime, true);

    }
    
    
}