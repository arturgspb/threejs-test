import React, {useEffect} from "react";
import styled from "styled-components";

const Title = styled.div`
font-size: 4em;
margin-bottom: 35px;
font-family: 'Faster One', cursive;
color: #f971ee;
  animation: glow 2500ms linear infinite 2000ms;

  @keyframes glow {
    40% {
      text-shadow: 0 0 4px #ff71f4;
    }
  }
`;

const MenuLayout = styled.div`
  padding: 10px;
  position: fixed;
  top: 15%;
  width: 400px;
  left: 50%;
  margin-left: -200px;
`;


const StartBtn = styled.button`
  padding: 10px;
  margin: 6px;
  cursor: pointer;
  background: rgb(255, 241, 123);
  color: #000;
  font-size: 2em;
  width: 100%;
  border-radius: 35px;
  outline: none;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  border-color: transparent;
  &:hover {
    background: rgb(255,215,96);
  }
`;

const Keys = styled.div`
  margin-top: 50px;
  padding: 0 110px;
  text-align: left;
`;

type MenuProps = {
  selectGame: Function,
}


function Menu({selectGame}: MenuProps) {
  function select(gameDifficultyLevel: string) {
    selectGame(gameDifficultyLevel);
  }

  useEffect(() => {
    let onPressG = (e: any) => {
      if (e.code === 'KeyG') {
        select("go");
      }
    };
    document.addEventListener('keypress', onPressG);

    return () => {
      document.removeEventListener('keypress', onPressG);
    };
  }, []);

  return (
    <MenuLayout>
      <Title>
        Flamingo GO!
      </Title>
      <div>

        <StartBtn onClick={() => {
          select("go")
        }}>Press 'g' to Go <span role={"img"}>☠️</span>️</StartBtn>

        {/*<StartBtn onClick={() => {*/}
        {/*  select("easy")*/}
        {/*}}>Easy</StartBtn>*/}

        {/*<StartBtn onClick={() => {*/}
        {/*  select("medium")*/}
        {/*}}>Medium</StartBtn>*/}

        {/*<StartBtn onClick={() => {*/}
        {/*  select("nightmare")*/}
        {/*}}>Nightmare ☠️</StartBtn>*/}
      </div>
      <Keys>
        <b>Control Keys:</b>
        <p>ArrowLeft - left move</p>
        <p>ArrowRight - right move</p>
        <p>ArrowUp - speed up</p>
        <p>ArrowDown - slow down</p>
        <p>Space - Turbo mode 🤘</p>
      </Keys>
    </MenuLayout>
  );
}

export default Menu;
