import { eventHub } from "../Event/EventHub";
import { GameEvents } from "../Event/GameEvents";
import type { UIManager } from "../UI/UIManager";
import type { InputManager } from "../input/InputManager";

export const GameState = {  InitialCountdown: 'InitialCountdown',  Playing: 'Playing',  Loss: 'Loss',  Victory: 'Victory',} as const;
export type GameState = typeof GameState[keyof typeof GameState];

export class GameManager {
    private readonly matchTime : number = 60;
    private readonly initialCountdown : number = 3;

    public currentState: GameState = GameState.InitialCountdown;

    private currentMatchTime : number = this.matchTime;
    private currentCountdown : number = this.initialCountdown;

    private uiManager : UIManager;
    private inputManager : InputManager;

    private score: number = 0;

    private readonly onPlayerDied = (data?: unknown) => this.OnPlayerDied(data);
    private readonly onEnemyDied  = (data?: unknown) => this.OnEnemyDied(data);

    constructor(uiManager : UIManager, inputManager : InputManager){
        eventHub.subscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
        eventHub.subscribe(GameEvents.ENEMY_DIED,  this.onEnemyDied);
        this.uiManager = uiManager;
        this.inputManager = inputManager;
        this.currentState = GameState.InitialCountdown;
    }

    public destroy(){
        eventHub.unsubscribe(GameEvents.PLAYER_DIED, this.onPlayerDied);
        eventHub.unsubscribe(GameEvents.ENEMY_DIED,  this.onEnemyDied);
    }

    private OnPlayerDied (_data?: unknown) {
        if (this.currentState === GameState.Playing) {
            this.changeState(GameState.Loss);
        }
    };

    private OnEnemyDied (_data?: unknown) {
        if (this.currentState !== GameState.Playing)  //ignore if not playing, because at the end everyone is destroyed
            return;

        this.score++;
        this.uiManager.updateScore(this.score);
    }

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
                this.uiManager.showTextOnScreenCenter("GAME OVER!");
                this.uiManager.showRestartPrompt(true);
                this.checkRestartInput();
                break;

            case GameState.Victory:
                this.uiManager.showTextOnScreenCenter("VICTORY!");
                this.uiManager.showRestartPrompt(true);
                this.checkRestartInput();
                break;

        }
    }

    private checkRestartInput(): void {
        if (this.inputManager.tryConsumeAction("restart")) {
            eventHub.trigger(GameEvents.RESTART_REQUESTED);
        }
    }

    private changeState(newState: GameState): void {
        this.currentState = newState;
        console.log("state changed to: " + newState);
        
        this.uiManager.ResetTexts();

        eventHub.trigger(GameEvents.GAME_STATE_CHANGED, newState);
    }


}