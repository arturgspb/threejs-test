import React, {Component} from "react";
import Engine from "../game/engine";

class GameContainer extends Component {
  componentDidMount() {
    const container = document.getElementById('container');
    if (container !== null) {
      let engine = new Engine(container);
      engine.run();
    }
  }

  render() {
    return <div id="container"/>
  }
}

export default GameContainer;
