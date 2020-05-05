import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import World from "./World";
import WorldConstants from "./WorldConstants";
import BgMusic from "./BgMusic";

class GameEngine {

  private container: HTMLElement;

  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: any;

  private mixers: THREE.AnimationMixer[] = [];
  private HERO: any;
  private clock = new THREE.Clock();
  private isLoose = false;
  private isFinish = false;
  private isStopped = false;
  private isResumed = false;
  private armMovement = 0;
  private leftMovement = 0;
  private rightMovement = 0;
  private turbo = false;
  private speedRate = 1;
  private currSpeed = 1;
  private collisions = [];
  private world: World;
  private bgMusic: BgMusic;
  private worldConstants: WorldConstants;

  public dispatch: Function;

  constructor(container: HTMLElement, dispatch: Function) {
    this.container = container;
    this.dispatch = dispatch;

    // view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);

    this.scene = new THREE.Scene();
    this.worldConstants = new WorldConstants();
    this.world = new World(this.worldConstants);
    this.bgMusic = new BgMusic(this);
    this.bgMusic.play();
  }

  destroy() {
    this.bgMusic.stopAll();
  }

  getScene() {
    return this.scene;
  }

  getRenderer() {
    return this.renderer;
  }

  getCamera() {
    return this.camera;
  }

  run() {
    this.init();
    this.animate();
  }

  init() {
    this.initGraphics();
    this.initObjects();
    this.initInput();
  }

  initGraphics() {
    this.camera.position.set(this.worldConstants.cameraBehind, this.worldConstants.cameraTop, 0);
    this.camera.rotation.set(0, this.worldConstants.cameraRotation, 0);

    // RENDERER
    let renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer = renderer;
    const onWindowResize = () => {
      if (this.camera) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      }
      if (this.renderer) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onWindowResize, false);
  }

  initInput() {
    window.addEventListener('keydown', (e) => {
      // console.log('event.code', e.code);
      switch (e.code) {
        case 'KeyP':
          this.pauseGame();
          break;

        case 'Escape':
          if (this.isFinish || this.isLoose) {
            this.bgMusic.stopAll();
            this.dispatch({type: "menu_game"})
          }
          break;

        case 'ArrowRight':
          this.armMovement = 1;
          this.rightMovement = 1;
          break;
        case 'ArrowLeft':
          this.armMovement = -1;
          this.leftMovement = 1;
          break;
        case 'ArrowUp':
          if (!this.turbo) {
            this.speedRate = 3;
          }
          break;
        case 'ArrowDown':
          if (!this.turbo) {
            this.speedRate = 0.5;
          }
          break;
        case 'Space':
          if (!this.turbo) {
            this.bgMusic.playTurbo();
          }
          this.speedRate = 4;
          this.turbo = true;
          break;
      }
    }, false);
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.turbo = false;
        this.bgMusic.stopTurbo();
      }
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'Space') {
        if (!this.turbo) {
          this.speedRate = 1;
        }
      }
      if (e.code === 'ArrowLeft') {
        this.leftMovement = 0;
      }
      if (e.code === 'ArrowRight') {
        this.rightMovement = 0;
      }
      if (this.leftMovement > 0) {
        this.armMovement = -1;
      } else if (this.rightMovement > 0) {
        this.armMovement = 1;
      } else {
        this.armMovement = 0;
      }
    }, false);
  }

  private pauseGame() {
    let state = this.dispatch({type: "toggle_pause_game"});

    this.isStopped = (state.status === 'pause');
    if (this.isStopped) {
      this.bgMusic.pause();
    } else {
      this.bgMusic.resume();
    }
    if (!this.isStopped) {
      this.isResumed = true;
    }

  }

  initObjects() {
    // GROUND

    this.world.addGround(this);
    this.world.addSky(this);

    for (let i = 0; i < this.worldConstants.boxCount; i++) {
      this.addBox(this.scene, i);
    }

    var loader = new GLTFLoader();

    loader.load('models/gltf/Flamingo.glb', (gltf) => {
      var mesh = gltf.scene.children[0];

      var s = 0.35;
      mesh.scale.set(s, s, s);
      mesh.position.x = -1000;
      mesh.position.y = this.worldConstants.heroY;
      mesh.rotation.y = 1.55;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.HERO = mesh;

      // @ts-ignore
      this.scene.add(mesh);

      var mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
      this.mixers.push(mixer);
    });
  }

  addBox(scene: any, x = 0) {
    let height = 50;
    let boxMaxWidth = this.worldConstants.boxMaxWidth;

    let cx = this.worldConstants.boxXCoordsOffset * x;
    let cy = height / 2;
    let cz = (Math.random() * boxMaxWidth) - (boxMaxWidth / 2);

    var geometry = new THREE.BoxGeometry(10, height, 10);
    var material = new THREE.MeshPhongMaterial({color: 0xFF9500});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = cx;
    cube.position.y = cy;
    cube.position.z = cz;
    cube.rotation.set(0, Math.random(), 0);
    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);

    // @ts-ignore
    let H_width = cube.geometry.parameters.width;
    // @ts-ignore
    let H_height = cube.geometry.parameters.height;
    var bounds = {
      xMin: cube.position.x - H_width / 2,
      xMax: cube.position.x + H_width / 2,
      yMin: cube.position.y - H_height / 2,
      yMax: cube.position.y + H_height / 2,
      zMin: cube.position.z - H_width / 2,
      zMax: cube.position.z + H_width / 2,
    };
    // @ts-ignore
    this.collisions.push(bounds);
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    if (this.isLoose) {
      return;
    }
    if (this.isFinish) {
      return;
    }
    if (this.isStopped) {
      return;
    }
    this.render();
  }

  /**
   * To make this transition extra smooth, we’ll use linear interpolation (lerp) for the speedUp variable.
   * https://tympanus.net/codrops/2019/11/13/high-speed-light-trails-in-three-js/
   */
  lerp(current: number, target: number, speed = 0.1, limit = 0.001) {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
      change = target - current;
    }
    return change;
  }

  update(delta: number) {
    if (!this.HERO) {
      return;
    }
    this.currSpeed += this.lerp(this.currSpeed, this.speedRate, 0.05);
    let baseSpeed = 350 * delta;
    let moveDistance = (baseSpeed * this.currSpeed); // 200 pixels per second
    let horizontalSpeed = (this.currSpeed > 1 ? baseSpeed / 5 : baseSpeed / 4);

    if (this.armMovement > 0) {
      if (this.HERO.position.z + horizontalSpeed < this.worldConstants.boxMaxWidth / 2) {
        this.HERO.position.z += horizontalSpeed;
        this.HERO.rotation.x += this.lerp(
          this.HERO.rotation.x,
          1,
          0.05
        );
        if (this.worldConstants.moveCameraZ && this.HERO.position.z > 50) {
          this.camera.position.z += horizontalSpeed;
        }
      }
    } else if (this.armMovement < 0) {
      if (this.HERO.position.z - horizontalSpeed > -this.worldConstants.boxMaxWidth / 2) {
        this.HERO.position.z -= horizontalSpeed;
        this.HERO.rotation.x -= this.lerp(
          Math.abs(this.HERO.rotation.x),
          1,
          0.05
        );
        if (this.worldConstants.moveCameraZ && this.HERO.position.z < -50) {
          this.camera.position.z -= horizontalSpeed;
        }
      }
    } else {
      this.HERO.rotation.x = 0;
    }

    this.HERO.position.x += moveDistance;

    if (this.turbo) {
      this.camera.position.x += moveDistance;
    } else {
      this.camera.position.x += moveDistance;
    }

    let fovTarget = this.turbo ? 60 : 35;
    let fovChange = this.lerp(this.camera.fov, fovTarget, 0.17);
    if (fovChange !== 0) {
      this.camera.fov += fovChange * delta * 6.;
      this.camera.updateProjectionMatrix();
    }
    this.camera.position.y += (fovChange / 2) * delta * 6.;

    this.world.moveX(moveDistance);
  }

  render() {
    let delta = this.clock.getDelta();
    if (this.isResumed) {
      this.isResumed = false;
      return;
    }

    for (let i = 0; i < this.mixers.length; i++) {
      // @ts-ignore
      if (this.mixers[i]) {
        this.mixers[i].update(delta);
      }
    }
    this.update(delta);
    this.detectCollisions();
    this.detectFinish();
    this.renderer.render(this.scene, this.camera);
  }

  looseGame() {
    if (this.isLoose) {
      return;
    }
    this.bgMusic.stopTurbo();
    this.isLoose = true;
    this.dispatch({type: "loose_game"});
  }

  finishGame() {
    if (this.isLoose) {
      return;
    }
    if (this.isFinish) {
      return;
    }

    this.isFinish = true;
    this.dispatch({type: "finish_game"});
  }

  detectCollisions() {
    if (!this.HERO) {
      return;
    }

    let H_width = 10;
    let H_height = 10;

    let bounds = {
      xMin: this.HERO.position.x - H_width / 2,
      xMax: this.HERO.position.x + H_width / 2,
      yMin: this.HERO.position.y - H_height / 2,
      yMax: this.HERO.position.y + H_height / 2,
      zMin: this.HERO.position.z - H_width / 2,
      zMax: this.HERO.position.z + H_width / 2,
    };

    // Run through each object and detect if there is a collision.
    for (let index = 0; index < this.collisions.length; index++) {
      let currColl: any = this.collisions[index];

      if ((bounds.xMin <= currColl.xMax && bounds.xMax >= currColl.xMin) &&
        (bounds.yMin <= currColl.yMax && bounds.yMax >= currColl.yMin) &&
        (bounds.zMin <= currColl.zMax && bounds.zMax >= currColl.zMin)) {
        if (this.worldConstants.looseOnBoxContact) {
          this.looseGame();
        }
      }
    }
  }


  detectFinish() {
    if (!this.HERO) {
      return;
    }
    let lastBox: any = this.collisions[this.collisions.length - 1];
    if (lastBox.xMax - this.HERO.position.x < -200) {
      this.finishGame();
    }
  }
}

export default GameEngine;
