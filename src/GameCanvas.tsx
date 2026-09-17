import { useEffect, useRef } from "react";
import { Game } from "./game/Game";

/*
 GameCanvas (React Host / Viewport Bridge)
 
  Acts as the host viewport (similar to Unity's Game View or standalone player window).
  It mounts the container <div> in the DOM and connects React's lifecycle to the Game
  instance (game.init and game.destroy).
 
 */
export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // instantiate the game manager
    const game = new Game();
    game.init(containerRef.current);

    // cleanup when the component unmounts (or on Strict Mode remount)
    return () => {
      game.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}