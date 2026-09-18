export const GameEvents = {
    UPDATEABLE_INSTANTIATED: "UpdeatbleInstantiated",
    UPDATEABLE_DESPAWNED: "UpdateableDespawned",

    COLLIDEABLE_INSTANTIATED: "CollideableInstantiated",
    COLLIDEABLE_DESPAWNED: "CollideableDespawned",
} as const;

export type GameEventType = typeof GameEvents[keyof typeof GameEvents];