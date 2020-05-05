import React from "react";

import {createContext} from "react";

export interface IGameState {
  gameTimeSec: number;
  status: string;
}

interface IGameContext {
  state: IGameState,
  dispatch: Function
}

export const GameContext = createContext({} as IGameContext);

// @ts-ignore
class Store extends React.Component<any, IGameState> {

  constructor(props: any) {
    super(props);

    this.state = {
      gameTimeSec: 0,
      status: 'running',
    } as IGameState;
  }

  reducer(state: IGameState, action: any) {
    switch (action.type) {
      case 'inc_time':
        let gameTimeSec = state.gameTimeSec || 0;
        gameTimeSec++;
        return {...state, gameTimeSec: gameTimeSec};

      case 'toggle_pause_game':
        let newStatus;
        if (state.status === 'pause') {
          newStatus = 'running';
        } else {
          newStatus = 'pause';
        }
        return {...state, status: newStatus};

      case 'loose_game':
        return {...state, status: 'loose'};

      default:
        return state;
    }
  };

  render() {
    const dispatch = (action: any) => {
      let newState = this.reducer(this.state, action);
      this.setState(newState);
      return newState;
    };

    return (
      <GameContext.Provider value={{
        state: this.state,
        dispatch: dispatch,
      }}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}

export default Store;
