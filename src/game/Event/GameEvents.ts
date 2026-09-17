export const GameEvents = {
    PROJECTILE_SPAWNED: "ProjectileSpawned",
    PROJECTILE_DESPAWNED: "ProjectileDespawned",
} as const;

export type GameEventType = typeof GameEvents[keyof typeof GameEvents];