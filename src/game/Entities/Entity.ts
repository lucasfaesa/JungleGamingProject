import { Container, Graphics, Point } from "pixi.js";

//anything that can live in the world, player, enemies, props, etc, inherits from container so i can use position and 
//easily add to the "world"
export class Entity extends Container{
    
    private sprite: Graphics | null = null;

    //sprite is optional "?", if not assigned, we use a red square
    constructor(newPosition: Point, rotation : number = 0, newSprite?: Graphics | null) {
        super();

        //centering the anchor of the graphics "-25, -25"
        const graphic = newSprite ?? new Graphics().rect(-25, -25, 50, 50).fill(0xff0000);
        this.setSprite(graphic);

        this.position.copyFrom(newPosition);
        this.rotation = rotation;
    }

    public setSprite(newSprite: Graphics) {
        if (this.sprite) {
            this.removeChild(this.sprite);
        }

        this.sprite = newSprite;
        this.addChild(newSprite);
    }

}