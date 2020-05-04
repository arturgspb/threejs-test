import React, {Component} from 'react';
import Timer from "./components/Timer";
import GameContext, {GameInfo} from "./ctx/GameContext";
import GameContainer from "./components/GameContainer";

const defaultGameInfo: GameInfo = {
  gameState: "start"
};

class Game extends Component {
  render() {
    return (
      <div>
        <GameContext.Provider value={defaultGameInfo}>
          <GameContainer/>
          <Timer/>
        </GameContext.Provider>
      </div>
    )
  }
}

export default Game;
