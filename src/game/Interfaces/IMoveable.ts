export interface IMoveable {
  moveVertical(deltaTime : number, negativeInput : boolean): void;
  rotate(deltaTime : number, negativeInput : boolean) : void;
}