import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export function GameCanvas() {

  //useRef keeps the direct reference to a HTML element
  //think as a public field in unity inspector
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: Application | null = null;
    let destroyed = false;

    // Unity Analogy, awake/start
    // async function that acts as the initialization of the engine and scene
    const initPromise = (async () => {
        //Application is the heart of Pixi, manages the renderer [webgl] and scene root
        const newApp = new Application();

        
        // app.init initializes the webgl context and graphic systems, like a unity boot
        await newApp.init({ width: 800, height: 600, backgroundColor: 0x1099bb });

        //In react [strict mode], the component mounts and unmounts immediately in dev mode
        //if it was unmount before init finishes on gpu, we clean it up without trying to run the game
        if (destroyed) {
            newApp.destroy({ removeView: true }, { children: true });
            return;
        }

        app = newApp;
        // Insert the canvas generated on the screen (like rendring a camera viewport)
        containerRef.current?.appendChild(newApp.canvas);

        // Unity equivalent, gameobject with a sprite/mesh rend
        const square = new Graphics().rect(0, 0, 50, 50).fill(0xff0000);

        // like transform.position.x or .position.y
        square.x = 100;
        square.y = 100;

        // Unity analogy, scene hierarchy, instantiate()
        // app.stage is the root scene
        // addChild() is the equivalent of putting a gameobject inside the scene hierarchy
        newApp.stage.addChild(square);

        // Unity analogy, update()
        // newApp.ticker is the game loop, executes every frame
        // ticker.deltaTime is Time.deltaTime
        newApp.ticker.add((ticker) => {
            square.x += 0.1 * ticker.deltaTime;
        });
    })();

    // Unity equivalent: OnDestroy
    // executes when the component leaves the scene, or on the double cicle strict mode
    return () => {
      destroyed = true;
      initPromise.then(() => {
        if (app) {
          app.destroy({ removeView: true }, { children: true });
          app = null;
        }
      });
    };
  }, []);

  return <div ref={containerRef} />;
}