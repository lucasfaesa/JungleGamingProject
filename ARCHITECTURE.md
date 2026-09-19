# Architecture & Technical Decisions: Pirate Battle

This document outlines the architectural patterns, structural trade-offs, and technical choices adopted in the development of the Pirate Battle 2D naval shooter, developed for Jungle Gaming within a 2-day timeframe.

---

## 1. Core Architectural Principles & Patterns

### 1.1 SOLID Principles & Interface-Driven Design

*Dev Note: I really like following SOLID principles and applying interfaces whenever possible. It makes handling and passing objects across different subsystems much easier. For instance, colliders implementing `ICollideable` make collision checks straightforward, and components like `Canon` allow any entity to gain shooting capabilities simply by attaching it, keeping things thoroughly decoupled.*

The codebase uses dedicated contracts in `src/game/Interfaces/` to decouple systems:

- **`ICollideable`**: Exposes coordinates, bounds, and collision response hooks (`getCollisionPoints`, `onCollision`). This allows `CollisionManager` to query and resolve physics without depending on concrete classes.

- **`IDamageable` & `IDamageDealer`**: Isolates combat rules (damage calculation and health deduction) from rendering and physics.

- **`IShooter` & `IUpdateable`**: Standardizes weapons and frame-tick loops across entities, maps, and managers.

This interface-first approach ensures that subsystems (`CollisionManager`, `Spawner`, `World`) interact only through strict contracts, keeping dependencies minimal and predictable.

---

### 1.2 Event-Driven Architecture (`EventHub`)

*Dev Note: I'm a big fan of event-driven architecture. Whenever possible, I use a central EventHub that connects the entire application, significantly reducing coupling where needed, always being careful to subscribe and unsubscribe properly to prevent memory leaks. At the same time, this doesn't stop me from letting classes communicate directly when appropriate, like the PlayerController working directly with the Player and InputManager.*

Global communication runs through a centralized Publish/Subscribe hub in `src/game/Event/EventHub.ts`:

- **Decoupled Lifecycle**: Entities announce their creation and removal via events (`UPDATEABLE_INSTANTIATED`, `COLLIDEABLE_INSTANTIATED`), letting `World` and `CollisionManager` register them without holding direct references.

- **Match Progression**: State shifts (`PLAYER_DIED`, `ENEMY_DIED`, `GAME_STATE_CHANGED`, `RESTART_REQUESTED`) notify UI and managers cleanly across boundaries.

- **Subscription Hygiene**: Every listener is explicitly unsubscribed inside its `destroy()` method to prevent memory leaks during restarts.

- **Direct Communication**: Classes requiring tight per-frame coordination (like `PlayerController` reading `InputManager` and updating `Player`) use direct references to eliminate unnecessary event overhead.

---

### 1.3 Composition vs. Inheritance

*Dev Note: I'm a strong advocate for "composition over inheritance" and I did use composition in some parts of the project (such as `Canon`, `HealthBar`, and `PlayerController`). However, inheritance was the predominant approach used throughout this project because it was much faster and more straightforward to implement under the 2-day deadline. That being said, I recognize that relying heavily on inheritance can become messy and confusing as a project scales, like the chain `Entity -> Ship -> EnemyShip -> Chaser`.*

Inheritance served as the fast foundation for entity sharing, while composition was applied to distinct functional units:

- **`Canon` Component**: An autonomous child entity that mounts onto ships, handling its own rotational offsets and projectile spawning without bloating ship classes.

- **`HealthBar` Component**: A self-contained UI container that manages graphics and counter-rotation independently from ship movement.

- **`PlayerController`**: Decouples player input handling from the underlying `Player` ship mechanics.

In a larger production environment, evolving this inheritance tree into a component-first architecture would be the recommended next step to prevent rigid hierarchy coupling.

---

### 1.4 State Machine & Object Pooling

*Dev Note: I really like state machines and object pooling. In this project, I opted for a simple state machine using enums and switch cases directly in the GameManager, which handled the scope perfectly. Object pooling wasn't implemented because projectile volume doesn't impact performance right now. A simple lifecycle timeout easily gets the job done, though it would be the natural next enhancement.*

Match state is managed in `GameManager` via an enum-driven state machine (`InitialCountdown`, `Playing`, `Loss`, `Victory`):

- **Deterministic Transitions**: Evaluated cleanly through `switch-case` branches, coordinating countdowns, match timers, UI updates, and restart triggers.

- **Projectile Lifecycle**: Bullets are instantiated with a duration timeout (`timeout = 2s`) and destroyed immediately on collision. 

- **Performance**: Given the current entity count, the simulation maintains a steady 60 FPS without pooling. An Object Pool remains the planned optimization for high-density bullet-hell scenarios.

---

## 2. Artificial Potential Fields for Enemy AI

*Dev Note: One of the implementations that went beyond my prior domain experience, where I used AI as an engineering mentor and tutor, was enemy pathfinding using Potential Fields. The closer an enemy gets to a solid obstacle, the stronger the repulsive force pushing it away, while still aggressively pursuing the player.*

The **Chaser** navigates dynamically toward the player without running expensive grid-search algorithms (like A*) every frame. In `EnemyShip.ts`, steering is resolved using vector fields:

1. **Attraction**: Generates a normalized pull vector directly toward the player's position.

2. **Repulsion**: Solid island tiles within a proximity radius exert an "repulsive force" against the ship.

3. **Resultant Steering**: Summing both vectors produces a natural steering angle that glides around shorelines while maintaining aggressive pursuit.

## 3. AI Usage Disclosure

AI assistance was used throughout this challenge as an interactive engineering mentor, not as an agent working directly on the project. It never edited or modified my codebase. My background is in Unity/C#, so PixiJS and TypeScript were new to me, and I relied on AI the way I would rely on a tutor: to explain concepts, derive the mathematical formulas for steering vectors, structure the 2D grid tile mapping, and discuss architecture trade-offs.

In some cases, AI-provided examples and snippets were used as a reference, and I typed them into the project by hand, adapting them to my own structure.

I chose this approach deliberately: using AI as a teacher meant I had to understand each concept well enough to apply it, which is why the scope of the project reflects my learning curve within the 2-day timeframe. Had I used AI as a coding assistant, I could have delivered considerably more features, but I preferred to deliver a clean, functional game engine that I fully understand and can explain and extend.
