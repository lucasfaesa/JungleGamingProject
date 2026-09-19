import { Container, Text, TextStyle } from "pixi.js";

export class UIManager extends Container{
    
    private timerText: Text;
    private stateText: Text;
    private scoreText: Text;
    private tutorialText : Text;
    private restartPromptText: Text;

    constructor(){
        super();

        const timerStyle = new TextStyle({ fontFamily: "PirateViking", fontSize: 52, fontWeight: "normal", fill: "#FFFFFF",stroke: { color: "#000000", width: 4 }});
        this.timerText = new Text({ text: "", style: timerStyle });
        this.timerText.anchor.set(0.5, 0); //top center
        this.timerText.position.set(640, 20);
        this.addChild(this.timerText);

        const stateStyle = new TextStyle({fontFamily: "PirateAES",fontSize: 160,fontWeight: "normal",fill: "#ffff00",stroke: { color: "#000000", width: 6 }});
        this.stateText = new Text({ text: "", style: stateStyle });
        this.stateText.anchor.set(0.5, 0.5); //middle center
        this.stateText.position.set(640, 340);
        this.addChild(this.stateText);

        const restartStyle = new TextStyle({fontFamily: "PirateKids",fontSize: 32,fontWeight: "normal",fill: "#FFFFFF",stroke: { color: "#000000", width: 4 }});
        this.restartPromptText = new Text({ text: "", style: restartStyle });
        this.restartPromptText.anchor.set(0.5, 0.5);
        this.restartPromptText.position.set(640, 440);
        this.addChild(this.restartPromptText);

        const scoreStyle = new TextStyle({fontFamily: "PirateViking",fontSize: 40,fontWeight: "normal",fill: "#FFFFFF",stroke: { color: "#000000", width: 4 }});
        this.scoreText = new Text({ text: "Score: 0", style: scoreStyle });
        this.scoreText.anchor.set(1, 0); // right-aligned
        this.scoreText.position.set(1260, 20);
        this.addChild(this.scoreText);

        const tutorialTextStyle = new TextStyle({fontFamily: "PirateKids",fontSize: 22,fontWeight: "normal",fill: "#FFFFFF",stroke: { color: "#000000", width: 4 }});
        this.tutorialText = new Text({text: "W, A, S, D / Arrow keys - Move\nSpacebar - Shoot forward\nQ - Shoot left\nE - Shoot right", style: tutorialTextStyle});
        this.tutorialText.anchor.set(0,0) //left aligned
        this.tutorialText.position.set(10,650);
        this.addChild(this.tutorialText);

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

    public showRestartPrompt(visible: boolean){
        this.restartPromptText.text = visible ? "Press R to restart" : "";
    }

    public ResetTexts(){
        this.stateText.text = "";
        this.timerText.text = "";
        this.restartPromptText.text = "";
    }

    public destroy(){

    }
}