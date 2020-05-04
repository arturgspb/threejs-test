import React from "react";

export interface GameInfo {
  gameState: string
}
const GameContext = React.createContext({
  gameState: "none"
} as GameInfo);

export default GameContext;
