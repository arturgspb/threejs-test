import React, {useState} from 'react';
import './App.css';
import Game from "./Game";
import Store from "./GameStore";
import BgMusic from "./components/BgMusic";
import GA from "./components/GA";


function App() {
  return (
    <React.StrictMode>
      <link href="https://fonts.googleapis.com/css2?family=Faster+One&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet"/>
      <div className="App">
        <Store>
          <Game/>
          <BgMusic/>
          <GA/>
        </Store>
      </div>
    </React.StrictMode>
  );
}

export default App;
