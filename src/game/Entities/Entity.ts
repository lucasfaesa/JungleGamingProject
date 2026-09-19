import { Container, Graphics, Point, Sprite } from "pixi.js";

//anything that can live in the world, player, enemies, props, etc, inherits from container so i can use position and 
//easily add to the "world"
export class Entity extends Container{
    
    private sprite: Container | null = null;

    protected graphicSize : Point = new Point(10,10);

    //size is optional, as the objet can declare its size
    constructor(newPosition: Point, rotation : number = 0, size? : Point) {
        super();

        if(size != null)
            this.graphicSize = size;

        this.position.copyFrom(newPosition);
        this.rotation = rotation;
    }

    protected setSprite(newSprite: Graphics) {
        if (this.sprite) {
            this.removeChild(this.sprite);
        }

        this.sprite = newSprite;
        this.addChild(newSprite);
    }

    protected setSpriteByName(spriteName : string){
        const sprite = Sprite.from(spriteName);
        sprite.anchor.set(0.5,0.5);
        sprite.width = this.graphicSize.x;
        sprite.height = this.graphicSize.y;
        this.setSpriteImage(sprite);
    }

    protected setSpriteImage(newSprite: Container) {
        if (this.sprite) {
            this.removeChild(this.sprite);
        }

        this.sprite = newSprite;
        this.addChild(newSprite);
    }


}