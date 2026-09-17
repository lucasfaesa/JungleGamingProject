export interface IMoveable {
  moveSpeed: number;
  rotationSpeed: number;

  moveVertical(deltaTime : number, negativeInput : boolean): void;
  rotate(deltaTime : number, negativeInput : boolean) : void;
}