import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";

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
`;


function Timer(props: any) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  });

  return <Title>{seconds}</Title>;
}

export default Timer;
