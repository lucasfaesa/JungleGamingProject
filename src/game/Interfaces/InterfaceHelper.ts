import type { IDamageDealer } from "./IDamageDealer";
import type { IDamageable } from "./IDamageable";

export class InterfaceHelper {
    public static isDamageable(obj: unknown): obj is IDamageable {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "health" in obj &&
            typeof obj.health === "number" &&
            "onDamageTaken" in obj &&
            typeof obj.onDamageTaken === "function"
        );
    }

    public static isDamageDealer(obj: unknown): obj is IDamageDealer {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "damage" in obj &&
            typeof obj.damage === "number"
        );
    }
}
