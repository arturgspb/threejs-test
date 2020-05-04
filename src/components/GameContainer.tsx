import React, {Component, useContext, useEffect} from "react";
import Engine from "../game/engine";

function GameContainer() {

  useEffect(() => {
    const container = document.getElementById('container');
    if (container !== null) {
      let engine = new Engine(container);
      engine.run();
    }

    return function cleanup() {
      console.log('destroy scene');
    };
  });

  return <div id="container"/>
}

export default GameContainer;
