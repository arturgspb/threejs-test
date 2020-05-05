import * as THREE from "three";
import GameEngine from "./GameEngine";

/**
 * https://threejs.org/docs/#api/en/audio/Audio
 */
class BgMusic {

  private engine: GameEngine;
  private defaultSound: THREE.Audio;
  private turboSound: THREE.Audio;

  constructor(engine: GameEngine) {
    this.engine = engine;

    var listener = new THREE.AudioListener();
    this.engine.getCamera().add(listener);
    this.defaultSound = new THREE.Audio(listener);
    this.turboSound = new THREE.Audio(listener);

    let trackNum = this.getRandomInt(2);
    var audioLoader = new THREE.AudioLoader();

    audioLoader.load('/audio/boost_track1.mp3' , (buffer) => {
      this.turboSound.setBuffer(buffer);
      this.turboSound.setLoop(true);
      this.turboSound.setVolume(0.4);
    });

    audioLoader.load('/audio/track' + trackNum + '.mp3', (buffer) => {
      this.defaultSound.setBuffer(buffer);
      this.defaultSound.setLoop(true);
      this.defaultSound.setVolume(0.4);
      this.defaultSound.play();
    });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  play() {
    // this.defaultSound.play();
  }

  pause() {
    this.defaultSound.setVolume(0.1);
    this.turboSound.setVolume(0.1);
  }

  resume() {
    this.defaultSound.setVolume(0.4);
    this.turboSound.setVolume(0.4);
  }

  playTurbo() {
    this.turboSound.play();
    this.defaultSound.pause();
  }

  stopTurbo() {
    this.turboSound.pause();
    this.defaultSound.play();
  }

  stopAll() {
    this.turboSound.stop();
    this.defaultSound.stop();
  }
}


export default BgMusic;
