import React, {useContext, useEffect, useState} from "react";
import GameEngine from "../game/GameEngine";
import {GameContext} from "../GameStore";

function GameContainer() {

  const {state, dispatch} = useContext(GameContext);
  const [engine, setEngine] = useState<GameEngine>();
  useEffect(() => {
    const container = document.getElementById('container');
    if (container !== null) {
      let newEngine = new GameEngine(container, dispatch);
      setEngine(newEngine);
      newEngine.run();
    }
    return () => {
      console.log('destroy scene');
      if (engine) {
        console.log('REAL destroy scene');

        engine.destroy();
      }
    };
  }, []);

  return <div id="container"/>
}

export default GameContainer;
