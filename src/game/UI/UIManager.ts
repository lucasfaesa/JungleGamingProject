import { Container, Text, TextStyle } from "pixi.js";

export class UIManager extends Container{
    
    private timerText: Text;
    private stateText: Text;

    constructor(){
        super();

        const timerStyle = new TextStyle({fontFamily: "monospace", fontSize: 32, fontWeight:"bold", fill: "#FFFFFF", stroke:{color:"#000000", width:4}});
        this.timerText = new Text({ text: "", style: timerStyle });
        this.timerText.anchor.set(0.5,0); //bottom center
        this.timerText.position.set(640,20);
        this.addChild(this.timerText);

        const stateStyle = new TextStyle({fontFamily: "Arial", fontSize: 64, fontWeight: "bold", fill: "#ffff00", stroke: { color: "#000000", width: 6 },});
        this.stateText = new Text({ text: "", style: stateStyle });
        this.stateText.anchor.set(0.5,0.5);//middle center
        this.stateText.position.set(640,360);
        this.addChild(this.stateText);
    }

    public updateTimer(time: number){
        const secs = Math.ceil(time);
        this.timerText.text = `${secs}`;
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