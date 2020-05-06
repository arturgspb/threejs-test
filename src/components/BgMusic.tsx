import * as THREE from "three";
import React, {useContext, useEffect, useState} from "react";
import {GameContext} from "../GameStore";

/**
 * https://threejs.org/docs/#api/en/audio/Audio
 */

const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

const MUTE_VOL_LEVEL = 0.1;
const DEF_VOL_LEVEL = 0.4;

function BgMusic() {
  const {state} = useContext(GameContext);
  const [defaultSound, setDefaultSound] = useState<THREE.Audio>();
  const [turboSound, setTurboSound] = useState<THREE.Audio>();

  const play = (turbo: boolean) => {
    if (turbo) {
      if (turboSound) {
        turboSound.setVolume(DEF_VOL_LEVEL);
        turboSound.play();
      } else {
        let newTurboSound = new THREE.Audio(listener);

        audioLoader.load('/audio/boost_track1.mp3', (buffer) => {
          newTurboSound.setBuffer(buffer);
          newTurboSound.setLoop(true);
          newTurboSound.setVolume(DEF_VOL_LEVEL);
          newTurboSound.play();
        });

        setTurboSound(newTurboSound);
      }

      if (defaultSound) {
        defaultSound.pause();
      }
    } else {
      if (defaultSound) {
        defaultSound.setVolume(DEF_VOL_LEVEL);
        defaultSound.play();
      } else {
        let newDefaultSound = new THREE.Audio(listener);

        let trackNum = getRandomInt(2);
        audioLoader.load('/audio/track' + trackNum + '.mp3', (buffer) => {
          newDefaultSound.setBuffer(buffer);
          newDefaultSound.setLoop(true);
          newDefaultSound.setVolume(DEF_VOL_LEVEL);
          newDefaultSound.play();
        });

        setDefaultSound(newDefaultSound);
      }

      if (turboSound) {
        turboSound.pause();
      }
    }
  };


  useEffect(() => {
    if (state.status) {
      if (state.status === 'running') {
        play(false);
      } else {
        if (defaultSound) {
          defaultSound.setVolume(MUTE_VOL_LEVEL);
        }
        if (turboSound) {
          turboSound.setVolume(MUTE_VOL_LEVEL);
        }
      }
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status !== 'menu') {
      if (state.turbo) {
        play(true);
      } else {
        play(false);
      }
    }
  }, [state.turbo]);

  return (
    <div></div>
  );
}

export default BgMusic;
