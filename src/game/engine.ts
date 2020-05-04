import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import World from "./world";

class Engine {

  private container: HTMLElement;

  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: any;

  private mixers: THREE.AnimationMixer[] = [];
  private HERO: any;
  private clock = new THREE.Clock();
  private isFinish = false;
  private armMovement = 0;
  private leftMovement = 0;
  private rightMovement = 0;
  private turbo = 0;
  private speedRate = 1;
  private collisions = [];

  constructor(container: HTMLElement) {
    this.container = container;

    // view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);

    this.scene = new THREE.Scene();
  }

  getScene() {
    return this.scene;
  }

  getRenderer() {
    return this.renderer;
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

    let cameraTop = 60;
    let cameraBehind = -1150;
    let cameraRotation = -1.6;

    this.camera.position.set(cameraBehind, cameraTop, 0);
    this.camera.rotation.set(0, cameraRotation, 0);

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;

    window.addEventListener('resize', this.onWindowResize, false);
  }

  initInput() {
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowRight':
          this.armMovement = 1;
          this.rightMovement = 1;
          break;
        case 'ArrowLeft':
          this.armMovement = -1;
          this.leftMovement = 1;
          break;
        case 'ArrowUp':
          this.speedRate = 3;
          break;
        case 'ArrowDown':
          this.speedRate = 0.5;
          break;
        case 'Space':
          this.speedRate = 6;
          this.turbo = 1;
          break;
      }
    }, false);
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.turbo = 0;
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

  initObjects() {
    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshLambertMaterial({color: 0xffffff});
    groundMat.color.setHSL(0.095, 1, 0.75);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    // @ts-ignore
    this.scene.add(ground);

    let world = new World();
    world.addSky(this);

    for (let i = 0; i < 100; i++) {
      this.addBox(this.scene, i);
    }

    var loader = new GLTFLoader();

    loader.load('https://threejs.org/examples/models/gltf/Flamingo.glb', (gltf) => {
      var mesh = gltf.scene.children[0];

      var s = 0.35;
      mesh.scale.set(s, s, s);
      // высота фраминго
      mesh.position.x = -1000;
      mesh.position.y = 50;
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
    let boxMaxWidth = 200;

    let cx = 100 * x;
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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.render();
  }

  update(delta: number) {
    if (!this.HERO) {
      return;
    }
    let baseSpeed = 150 * delta;
    let moveDistance = (baseSpeed * this.speedRate); // 200 pixels per second
    let horizontalSpeed = (this.speedRate > 1 ? baseSpeed / 4 : baseSpeed / 3);

    if (this.armMovement > 0) {
      this.HERO.position.z += horizontalSpeed;
      this.HERO.rotation.x = 1;
    } else if (this.armMovement < 0) {
      this.HERO.position.z -= horizontalSpeed;
      this.HERO.rotation.x = -1;
    } else {
      this.HERO.rotation.x = 0;
    }

    this.HERO.position.x += moveDistance;
    // @ts-ignore
    this.camera.position.x += moveDistance;
  }

  render() {
    if (this.isFinish) {
      return;
    }
    let delta = this.clock.getDelta();

    for (let i = 0; i < this.mixers.length; i++) {
      // @ts-ignore
      if (this.mixers[i]) {
        this.mixers[i].update(delta);
      }
    }
    this.update(delta);
    this.detectCollisions();
    this.renderer.render(this.scene, this.camera);
  }

  stopMovement() {
    if (this.isFinish) {
      return;
    }
    this.isFinish = true;
    console.log('!Finish');
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
        this.stopMovement();
      }
    }
  }
}

export default Engine;
