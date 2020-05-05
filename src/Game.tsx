import React, {useContext, useEffect} from 'react';
import Timer from "./components/Timer";
import GameContainer from "./components/GameContainer";
import Store, {GameContext} from "./GameStore";
import Pause from "./components/Pause";
import Menu from "./components/Menu";


function Game() {

  const {state} = useContext(GameContext);

  return (
    <div>
      {state.status === 'menu' ? <Menu/>
        :
        <div>
          <GameContainer/>
          < Timer/>
          < Pause/>
        </div>
      }
    </div>
  )
}

export default Game;
