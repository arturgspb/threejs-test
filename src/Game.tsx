import React from 'react';
import Timer from "./components/Timer";
import GameContainer from "./components/GameContainer";
import Store from "./GameStore";
import Pause from "./components/Pause";


function Game() {

  console.log('Game')
  return (
    <Store>
      <GameContainer/>
      <Timer/>
      <Pause/>
    </Store>
  )
}

export default Game;
