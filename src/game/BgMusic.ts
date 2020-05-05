import * as THREE from "three";
import GameEngine from "./GameEngine";

/**
 * https://threejs.org/docs/#api/en/audio/Audio
 */
class BgMusic {

  private engine: GameEngine;
  private sound: THREE.Audio | null = null;

  constructor(engine: GameEngine) {
    this.engine = engine;


  }

  play() {
    var listener = new THREE.AudioListener();
    this.engine.getCamera().add(listener);
    this.sound = new THREE.Audio(listener);

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('/audio/boost_track1.mp3', (buffer) => {
      if (this.sound) {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(0.5);
        this.sound.play();
      }
    });
  }

  pause() {
    if (this.sound) {
      this.sound.setVolume(0.1);
    }
  }

  resume() {
    if (this.sound) {
      this.sound.setVolume(0.5);
    }
  }
}


export default BgMusic;
