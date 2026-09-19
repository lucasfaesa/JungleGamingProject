export const GameEvents = {
    UPDATEABLE_INSTANTIATED: "UpdeatbleInstantiated",
    UPDATEABLE_DESPAWNED: "UpdateableDespawned",

    COLLIDEABLE_INSTANTIATED: "CollideableInstantiated",
    COLLIDEABLE_DESPAWNED: "CollideableDespawned",

    PLAYER_DIED: "PlayerDied",
    ENEMY_DIED: "EnemyDied",

    GAME_STATE_CHANGED: "GameStateChanged",
} as const;

export type GameEventType = typeof GameEvents[keyof typeof GameEvents];