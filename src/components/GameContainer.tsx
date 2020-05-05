import React, {useContext, useEffect} from "react";
import GameEngine from "../game/GameEngine";
import {GameContext} from "../GameStore";

function GameContainer() {

  const {state, dispatch} = useContext(GameContext);

  useEffect(() => {
    const container = document.getElementById('container');
    if (container !== null) {
      let newEngine = new GameEngine(container, dispatch);
      newEngine.run();
    }
    return () => {
      console.log('destroy scene');
    };
  }, []);

  return <div id="container"/>
}

export default GameContainer;
