import React, {PropsWithoutRef, useContext} from "react";
import styled from "styled-components";

const Title = styled.div`
font-size: 4em;
margin-bottom: 15px;
font-family: 'Faster One', cursive;
color: #f971ee;
`;

const MenuLayout = styled.div`
  padding: 10px;
  position: fixed;
  top: 30%;
  width: 400px;
  left: 50%;
  margin-left: -150px;
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
  &:hover {
    background: rgb(255,215,96);
  }
`;

type MenuProps = {
  selectGame: Function,
}


function Menu({selectGame}: MenuProps) {
  function select(gameDifficultyLevel: string) {
    selectGame(gameDifficultyLevel);
  }

  return (
    <MenuLayout>
      <Title>
        Flamingo GO!
      </Title>
      <div>

        <StartBtn onClick={() => {
          select("go")
        }}>Go ☠️</StartBtn>

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
    </MenuLayout>
  );
}

export default Menu;
