import React from 'react';
import Timer from "./components/Timer";
import GameContainer from "./components/GameContainer";
import Store from "./GameStore";


function Game() {

  console.log('Game')
  return (
    <Store>
      <GameContainer/>
      <Timer/>
    </Store>
  )
}

export default Game;
