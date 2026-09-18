export interface IDamageable{
    health : number;
    isAlive : boolean;

    onDamageTaken(damage : number) : void;
}