export const CollisionType = {
    Island : 0,
} as const;

 export type CollisionType = (typeof CollisionType)[keyof typeof CollisionType];
