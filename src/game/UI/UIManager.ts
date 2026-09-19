import { Container, Text, TextStyle } from "pixi.js";

export class UIManager extends Container{
    
    private timerText: Text;
    private stateText: Text;
    private scoreText: Text;

    constructor(){
        super();

        const timerStyle = new TextStyle({
            fontFamily: "PirateViking",
            fontSize: 52,
            fontWeight: "bold",
            fill: "#FFFFFF",
            stroke: { color: "#000000", width: 4 }
        });
        this.timerText = new Text({ text: "", style: timerStyle });
        this.timerText.anchor.set(0.5, 0); //top center
        this.timerText.position.set(640, 20);
        this.addChild(this.timerText);

        const stateStyle = new TextStyle({
            fontFamily: "PirateAES",
            fontSize: 200,
            fontWeight: "bold",
            fill: "#ffff00",
            stroke: { color: "#000000", width: 6 }
        });
        this.stateText = new Text({ text: "", style: stateStyle });
        this.stateText.anchor.set(0.5, 0.5); //middle center
        this.stateText.position.set(640, 360);
        this.addChild(this.stateText);

        const scoreStyle = new TextStyle({
            fontFamily: "PirateViking",
            fontSize: 40,
            fontWeight: "bold",
            fill: "#FFFFFF",
            stroke: { color: "#000000", width: 4 }
        });
        this.scoreText = new Text({ text: "Score: 0", style: scoreStyle });
        this.scoreText.anchor.set(1, 0); // right-aligned
        this.scoreText.position.set(1260, 20);
        this.addChild(this.scoreText);
    }

    public updateTimer(time: number){
        const secs = Math.ceil(time);
        this.timerText.text = `${secs}`;
    }

    public updateScore(score: number){
        this.scoreText.text = `Score: ${score}`;
    }

    public showTextOnScreenCenter(message : string){
        this.stateText.text = message;
    }

    public ResetTexts(){
        this.stateText.text = "";
        this.timerText.text = "";
    }

    public destroy(){

    }
}