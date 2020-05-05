import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {GameContext} from "../GameStore";

const Title = styled.div`
  padding: 0 10px;
  font-size: 2.3em;
  color: #fff;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #f07f9e;
  position: fixed;
  top: 0;
  right: 0;
  
  background: #abbfde;
  border-radius: 10px;
  width: 200px;
`;


function Timer(props: any) {
  const {state, dispatch} = useContext(GameContext);
  const [timer, setTimer] = useState();

  function startTimer() {

    if (!timer) {
      const newTimer = setInterval(() => {
        dispatch({type: 'inc_time'});
      }, 1000);
      setTimer(newTimer);
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }

  useEffect(() => {
    // startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  useEffect(() => {
    if (state.status) {
      if (state.status === 'running') {
        startTimer();
      } else {
        stopTimer();
      }
    }
  }, [state.status]);

  return (
    <Title>
      {state.gameTimeSec} sec.
    </Title>
  );
}

export default Timer;
