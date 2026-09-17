
import { Player } from "../Player/Player"
import { InputManager } from "../input/InputManager";
import type {IUpdateable} from "../Interfaces/IUpdateable"

export class PlayerController implements IUpdateable{

    public player : Player;
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
        if(this.inputManager.actionsMap.shootFront)
            this.player.shootForward();
        if(this.inputManager.actionsMap.shootLeft)
            this.player.shootSideways(false);
        if(this.inputManager.actionsMap.shootRight)
            this.player.shootSideways(true);
    }
    
    
}