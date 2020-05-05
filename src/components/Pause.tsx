import React, {useContext} from "react";
import styled from "styled-components";
import {GameContext} from "../GameStore";

const Layer = styled.div`
  padding: 10px;
  position: fixed;
  top: 35%;
  width: 100%;
  text-align: center;
  background: #ffffffd1;
`;

const Title = styled.div`
  font-size: 7em;
  color: #fff;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #f07f9e;
  text-align: center;
`;

const Desc = styled.div`
  font-size: 2em;
  color: #000;
  text-align: center;
  padding-bottom: 10px;
`;

function Pause(props: any) {
  const {state} = useContext(GameContext);

  return (
    <div>{state.status === 'pause' ? <Layer>
      <Title>Pause</Title>
      <Desc>Press key "P" for resume</Desc>
    </Layer> : ''}</div>
  );
}

export default Pause;
