import React, {Component, useState} from 'react';
import Timer from "./components/Timer";
import GameContainer from "./components/GameContainer";


function Game() {

  return (
    <div>
      <GameContainer/>
      <Timer/>
    </div>
  )
}

export default Game;
