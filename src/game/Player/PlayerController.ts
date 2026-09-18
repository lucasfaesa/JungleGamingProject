
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
                
        if(this.inputManager.heldActionsMap.forward)
            this.player.moveVertical(deltaTime, false);
        if(this.inputManager.heldActionsMap.backwards)
            this.player.moveVertical(deltaTime, true);
        if(this.inputManager.heldActionsMap.rotateRight)
            this.player.rotate(deltaTime, false);
        if(this.inputManager.heldActionsMap.rotateLeft)
            this.player.rotate(deltaTime, true);

        if(this.inputManager.tryConsumeAction(this.inputManager.shootForwardAction))
            this.player.shoot();
        if(this.inputManager.tryConsumeAction(this.inputManager.shootLeftAction))
            this.player.shootSideways(false);
        if(this.inputManager.tryConsumeAction(this.inputManager.shootRightAction))
            this.player.shootSideways(true);
    }
    
    
}