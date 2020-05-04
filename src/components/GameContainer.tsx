import React, {useContext, useEffect, useReducer, useState} from "react";
import Engine from "../game/engine";
import {GameContext} from "../GameStore";

function GameContainer() {

  const {state, dispatch} = useContext(GameContext);

  console.log('GameContainer');

  useEffect(() => {
    const container = document.getElementById('container');
    if (container !== null) {
      let newEngine = new Engine(container, dispatch);
      newEngine.run();
    }
    console.log('GameContainer');

    return () => {
      console.log('destroy scene');
    };
  }, []);

  return <div id="container"/>
}

export default GameContainer;
