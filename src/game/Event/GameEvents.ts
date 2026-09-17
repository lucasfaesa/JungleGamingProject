export const GameEvents = {
    UPDATEABLE_INSTANTIATED: "UpdeatbleInstantiated",
    UPDATEABLE_DESPAWNED: "UpdateableDespawned",
} as const;

export type GameEventType = typeof GameEvents[keyof typeof GameEvents];