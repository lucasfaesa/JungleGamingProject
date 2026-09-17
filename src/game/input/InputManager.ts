export class InputManager {
    
    //game will check this each frame
    public forward = false;
    public rotateLeft = false;
    public rotateRight = false;
    public shootFront = false;
    public shootLeft = false;
    public shootRight = false;

    constructor(){
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    public destroy(){
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    private onKeyDown = (e: KeyboardEvent) => {

        switch(e.code){
            case "KeyW":
            case "ArrowUp":
                console.log("Move up");
                this.forward = true;
            break;
        }
    }

    private onKeyUp = (e: KeyboardEvent) => {

        switch(e.code){
            case "KeyW":
            case "ArrowUp":
                this.forward = false;
            break;
        }
    }
}