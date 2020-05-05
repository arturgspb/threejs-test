import React, {useState} from 'react';
import './App.css';
import Game from "./Game";
import Menu from "./components/Menu";


function App() {
  let [start, setStart] = useState(false);
  const selectGame = () => {
    setStart(true);
  };
  return (
    <React.StrictMode>
      <link href="https://fonts.googleapis.com/css2?family=Faster+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet" />
      <div className="App">
        {
          start ? <Game/> : <Menu selectGame={selectGame}/>
        }
      </div>
    </React.StrictMode>
  );
}

export default App;
