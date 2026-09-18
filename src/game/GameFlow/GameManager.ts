import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";

export const GameState = {  InitialCountdown: 'InitialCountdown',  Playing: 'Playing',  Loss: 'Loss',  Victory: 'Victory',} as const;
export type GameState = typeof GameState[keyof typeof GameState];

export class GameManager {
    private readonly matchTime : number = 60;
    private readonly initialCountdown : number = 3;

    public currentState: GameState = GameState.InitialCountdown;

    private currentMatchTime : number = this.matchTime;
    private currentCountdown : number = this.initialCountdown;

    private readonly onPlayerDied = (data?: unknown) => this.OnPlayerDied(data);

    constructor(){
        eventHub.subscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);

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
                console.log("countdown: " + this.currentCountdown);
                if (this.currentCountdown <= 0){
                    this.changeState(GameState.Playing);
                }
            break;

            case GameState.Playing:
                this.currentMatchTime -= deltaTime;
                //console.log("countdown: " + this.currentMatchTime);
                if(this.currentMatchTime <= 0){
                    this.currentMatchTime = 0;
                    this.changeState(GameState.Victory);
                }
            break;

            case GameState.Loss:
                break;

            case GameState.Victory:
                break;

        }
    }

    private changeState(newState: GameState): void {
        this.currentState = newState;
        console.log("state changed to: " + newState);
        
        eventHub.trigger(GameEvents.GAME_STATE_CHANGED, newState);
    }


}