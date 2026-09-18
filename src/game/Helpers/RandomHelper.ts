export class RandomHelper {

    public static randomFloat(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    public static randomInt(min: number, max: number): number {
        return Math.floor(RandomHelper.randomFloat(min, max + 1));
    }
}

