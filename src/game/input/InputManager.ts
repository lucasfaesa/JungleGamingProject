export class InputManager {
    
    
    public actionsMap: Record<string, boolean> = {
        forward : false,
        backwards : false,
        rotateLeft : false,
        rotateRight : false,
        shootFront : false,  
        shootLeft : false,
        shootRight : false,
    };

    private keysMap: Record<string, string> = {
        KeyW: "forward",
        ArrowUp: "forward",

        KeyA: "rotateLeft",
        ArrowLeft: "rotateLeft",

        KeyD: "rotateRight",
        ArrowRight: "rotateRight",
        
        KeyS: "backwards",
        ArrowDown : "backwards",

        Space: "shootFront",
    };

    constructor(){
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    public destroy(){
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const action : string = this.keysMap[e.code];

        if(action !== undefined){
            this.actionsMap[action] = true;
        }
    }

    private onKeyUp = (e: KeyboardEvent) => {

        const action : string = this.keysMap[e.code];

        if(action !== undefined){
            this.actionsMap[action] = false;
        }
    }
}