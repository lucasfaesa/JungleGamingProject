
import { Player } from "../Player/Player"
import { InputManager } from "../input/InputManager";
import type {IUpdateable} from "../Interfaces/IUpdateable"
import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import { GameState } from "../GameFlow/GameManager";

export class PlayerController implements IUpdateable{

    public player : Player;
    private inputManager : InputManager;

    private readonly onPlayerDied = (data?: unknown) => this.OnPlayerDied(data);
    private readonly onGameStateChanged    = (data?: unknown) => this.OnGameStateChanged(data);

    private canUpdate : boolean = false;

    constructor(player : Player, inputManager : InputManager){
        this.player = player;
        this.inputManager = inputManager;

        eventHub.subscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
        eventHub.subscribe(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged);

    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
        eventHub.unsubscribe(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged);
    }

    private OnGameStateChanged (data?: unknown){

        const gameState = data as GameState;

        switch(gameState){
            case GameState.InitialCountdown:
                this.canUpdate = false;
                break;
            case GameState.Playing:
                this.canUpdate = true;
                break;
            case GameState.Victory:
            case GameState.Loss:
                this.canUpdate = false;
                break;
        }
    
    };
    
    public update(deltaTime : number) : void{
                
        if(!this.canUpdate)
            return;

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

    private OnPlayerDied(_data? : unknown){
        console.log("player died");
        this.canUpdate = false;
    }
    
    
}