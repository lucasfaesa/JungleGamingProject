export const CollisionType = {
    Island : 0,
    Player : 1,
    Enemy : 2,
    PlayerProjectile : 3,
    EnemyProjectile : 4,
    DEFAULT : 20,
    NONE : 99
} as const;

 export type CollisionType = (typeof CollisionType)[keyof typeof CollisionType];
