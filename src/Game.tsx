import React, {Component} from 'react';
import * as THREE from "three";
import Engine from "./game/engine";

class Game extends Component {
    componentDidMount() {
        const container = document.getElementById('container');
        if (container !== null) {
            let engine = new Engine(container);
            engine.run();
        }
    }

    render() {
        return (
            <div>
                <div id="container"></div>
            </div>
        )
    }
}

export default Game;
