export class InputManager {
    
    public shootForwardAction : string = "shootFront";
    public shootRightAction : string = "shootRight";
    public shootLeftAction : string = "shootLeft";


    // read these every frame for continuous input, such as movement or rotation.
    public heldActionsMap: Record<string, boolean> = {
        forward : false,
        backwards : false,
        rotateLeft : false,
        rotateRight : false,
    };
    
    // actions that become active when the key is pressed and remain active until the key is released
    public pressedActionsMap: Record<string, boolean> = {
        shootFront : false,  
        shootLeft : false,
        shootRight : false,
        restart : false,
    };

    // tracks whether a pressed action has already been handled for the current key press
    // this prevents an action from being triggered multiple times while the key is held
    public consumedActionsMap: Record<string, boolean> = {
        shootFront: false,
        shootLeft: false,
        shootRight: false,
        restart: false,
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

        Space: this.shootForwardAction,

        KeyQ: this.shootLeftAction,
        KeyE: this.shootRightAction,

        KeyR: "restart",
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

        if(action === undefined)
            return;

        //saving pressed inputs this frame, we going to read every frame later
        if(action in this.heldActionsMap){
            this.heldActionsMap[action] = true;
        }
        //saving pressed inputs this frame as well, but we are going to compare later
        //and check if it was pressed this frame or it was already pressed previously
        else if (action in this.pressedActionsMap) {
            this.pressedActionsMap[action] = true;
        }
    }

    private onKeyUp = (e: KeyboardEvent) => {

        const action = this.keysMap[e.code];

        if (action === undefined)
            return;
    
        if (action in this.heldActionsMap) {
            this.heldActionsMap[action] = false;
        }

        if (action in this.pressedActionsMap) {
            this.pressedActionsMap[action] = false;
            this.consumedActionsMap[action] = false;
        }
    }

    // returns true only once per key press, once the action has been consumed, holding the key will not trigger it again
    // until the key is released and pressed again.
    public tryConsumeAction(action: string): boolean {
        if (!this.pressedActionsMap[action])
            return false;

        if (this.consumedActionsMap[action])
            return false;

        this.consumedActionsMap[action] = true;
        return true;
    }
}