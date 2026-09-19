import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { UIManager } from "../UI/UIManager";

export const GameState = {  InitialCountdown: 'InitialCountdown',  Playing: 'Playing',  Loss: 'Loss',  Victory: 'Victory',} as const;
export type GameState = typeof GameState[keyof typeof GameState];

export class GameManager {
    private readonly matchTime : number = 60;
    private readonly initialCountdown : number = 3;

    public currentState: GameState = GameState.InitialCountdown;

    private currentMatchTime : number = this.matchTime;
    private currentCountdown : number = this.initialCountdown;

    private uiManager : UIManager;

    private readonly onPlayerDied = (data?: unknown) => this.OnPlayerDied(data);

    constructor(uiManager : UIManager){
        eventHub.subscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
        this.uiManager = uiManager;
        this.currentState = GameState.InitialCountdown;
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
    }

    private OnPlayerDied (data?: unknown) {
        if (this.currentState === GameState.Playing) {
            this.changeState(GameState.Loss);
        }
    };

    public update(deltaTime: number){
        switch(this.currentState){
            
            case GameState.InitialCountdown:
                this.currentCountdown -= deltaTime;
                this.uiManager.showTextOnScreenCenter(Math.ceil(this.currentCountdown).toString());
                //console.log("countdown: " + this.currentCountdown);
                if (this.currentCountdown <= 0){
                    this.changeState(GameState.Playing);
                }
            break;

            case GameState.Playing:
                this.currentMatchTime -= deltaTime;
                this.uiManager.updateTimer(this.currentMatchTime);
                //console.log("countdown: " + this.currentMatchTime);
                if(this.currentMatchTime <= 0){
                    this.currentMatchTime = 0;
                    this.changeState(GameState.Victory);
                }
            break;

            case GameState.Loss:
                this.uiManager.showTextOnScreenCenter("GAME OVER!")
                break;

            case GameState.Victory:
                this.uiManager.showTextOnScreenCenter("VICTORY!")
                break;

        }
    }

    private changeState(newState: GameState): void {
        this.currentState = newState;
        console.log("state changed to: " + newState);
        
        this.uiManager.ResetTexts();

        eventHub.trigger(GameEvents.GAME_STATE_CHANGED, newState);
    }


}