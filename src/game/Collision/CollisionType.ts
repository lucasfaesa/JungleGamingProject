export const CollisionType = {
    Island : 0,
    Player : 1,
    Enemy : 2,
    Projectile : 3,
    DEFAULT : 4
} as const;

 export type CollisionType = (typeof CollisionType)[keyof typeof CollisionType];
