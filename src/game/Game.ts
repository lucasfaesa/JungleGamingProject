import { Application, Point } from "pixi.js";
import { InputManager } from "./input/InputManager";
import { Player } from "./Player/Player";
import { PlayerController } from "./Player/PlayerController";
import { World } from "./World/World";

/*
  Game (GameManager / Engine Coordinator)
 
  coordinates engine initialization (PixiJS), scene lifecycles, entities, and the main update loop (Update).
 */
export class Game {
  private app: Application | null = null;
  private isDestroyed = false;
  private initPromise: Promise<void> | null = null;
  private player: Player | null = null;
  private playerController : PlayerController | null = null;
  private world : World | null = null;
  private screenWidth = 800;
  private screenHeight = 600;
  private backgroundColor = 0x1099bb;
  private inputManager : InputManager;

  constructor(){
      this.inputManager = new InputManager();
  }

  // Like Unity's Awake: boots up Pixi engine and attaches canvas to the DOM container
  async init(container: HTMLElement): Promise<void> {
    this.initPromise = (async () => {
      const app = new Application();

      await app.init({
        width: this.screenWidth,
        height: this.screenHeight,
        backgroundColor: this.backgroundColor,
      });

      
      // if destroyed while init was still running (e.g. React Strict Mode in dev)
      if (this.isDestroyed) {
        app.destroy({ removeView: true }, { children: true });
        return;
      }
      
      this.app = app;
      container.appendChild(app.canvas);
      
      this.start();

      // Game loop: like Unity's Update() running each frame
      this.app.ticker.add((ticker) => {
        this.update(ticker.deltaTime);
      });
    })();

    return this.initPromise;
  }

  // Like Unity's Start(): runs once after init to spawn initial scene objects
  private start(): void {
    if (!this.app) return;

    this.world = new World(this.app.stage);
    //player
    this.player = new Player(new Point(100,100));
    this.playerController = new PlayerController(this.player, this.inputManager);

    // app.stage is the root scene hierarchy (like adding to active Scene)
    this.app.stage.addChild(this.player);
  }

  // Like Unity's Update(): runs every frame, ticker.deltaTime is like Time.deltaTime
  private update(deltaTime: number): void {
    
    this.world?.update(deltaTime);
    this.playerController?.update(deltaTime);
  }

  // Like Unity's OnDestroy(): frees GPU resources and removes the canvas
  async destroy(): Promise<void> {
    this.isDestroyed = true;

    this.world?.destroy();
    this.inputManager?.destroy();

    // wait for init to finish before destroying if it was still in progress
    if (this.initPromise) {
      await this.initPromise;
    }

    if (this.app) {
      this.app.destroy({ removeView: true }, { children: true });
      this.app = null;
    }
  }
}
