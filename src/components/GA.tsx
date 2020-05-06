import React, {useContext, useEffect} from "react";
import {GameContext} from "../GameStore";

function GA() {
  const {state} = useContext(GameContext);

  useEffect(() => {
    // @ts-ignore
    gtag('event', 'status_' + state.status, {
      'event_category': 'Status'
      });
  }, [state.status]);

  return (
    <div></div>
  );
}

export default GA;
