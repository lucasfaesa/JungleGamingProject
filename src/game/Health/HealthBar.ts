import { Container, Graphics } from "pixi.js";

export class HealthBar extends Container {
    private background: Graphics;
    private fill: Graphics;

    private barWidth : number = 50;
    private barHeight : number = 6;
    private maxHealth : number;

    constructor(maxHealth: number){
        super();
        this.maxHealth = maxHealth;
        
        //background
        this.background = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill({ color: 0x333333 });
        this.background.x = -this.barWidth / 2;
        this.addChild(this.background);
    
        //fill
        this.fill = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill({ color: 0xff3333 });
        this.fill.x = -this.barWidth / 2;
        this.addChild(this.fill);
    
        //y pos, under player
        this.y = 70;
    }

    //update heath bar size based on current health and max health
    public updateHealth(value : number){

        // keep health between 0 and max
        const safeHealth = Math.max(0, Math.min(value, this.maxHealth));

        //how many pixels of the bar should be filled
        const fillWidth = (safeHealth / this.maxHealth) * this.barWidth;

        // draw
        this.fill.clear().rect(0, 0, fillWidth, this.barHeight).fill({ color: 0x00FF00 });
    }

    public setMaxHealth(maxHealth: number): void {
        this.maxHealth = maxHealth;
        this.updateHealth(maxHealth);
    }

}
