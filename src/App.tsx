import React from 'react';
import './App.css';
import Game from "./Game";
import Timer from "./components/Timer";

function App() {
  return (
    <React.StrictMode>
    <div className="App">
      <Game/>
    </div>
    </React.StrictMode>
  );
}

export default App;
