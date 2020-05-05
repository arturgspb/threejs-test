import GameEngine from "./GameEngine";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import WorldConstants from "./WorldConstants";

class World {

  private dirLight: any;
  private hemiLight: any;
  private ground: any;
  private sky: any;
  private worldConstants: WorldConstants;

  constructor(worldConstants: WorldConstants) {
    this.worldConstants = worldConstants;
  }

  addGround(engine: GameEngine) {
    const scene = engine.getScene();

    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
    groundMat.color.setHSL(0.095, 1, 0.75);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    // @ts-ignore
    scene.add(ground);

    // http://localhost:3000/models/Grass.glb
    this.ground = ground;

    // var loader = new FBXLoader();
    // loader.load('models/tree2.fbx', function (mesh) {
    //   console.log('mesh', mesh);
    //   // var s = 0.05;
    //   // mesh.scale.set(s, s, s);
    //   // mesh.position.z += 400;
    //   mesh.castShadow = true;
    //   mesh.receiveShadow = true;
    //   scene.add(mesh);
    //
    // }, undefined, function (e) {
    //   console.error(e);
    // });


    var wGLTF_Loader = new GLTFLoader();
    wGLTF_Loader.load('models/gltf/tree2.glb', (gltf) => {
      let model = gltf.scene;

      for (let i = 0; i < this.worldConstants.boxCount; i += 7) {
        let s = 100 + (Math.random() * 100);

        let cModel = model.clone();
        cModel.scale.set(s, s, s);
        let mz = (Math.random() * 100) + (this.worldConstants.boxMaxWidth);
        if (Math.random() > 0.5) {
          mz = mz * -1;
        }
        cModel.position.z = mz;
        let mx = (Math.random() * 100) + this.worldConstants.boxXCoordsOffset * i;
        cModel.position.x = mx;
        cModel.castShadow = true;
        cModel.receiveShadow = true;

        scene.add(cModel);
      }
    });

    // wGLTF_Loader.load('models/mount1.glb', (gltf) => {
    //   let model = gltf.scene;
    //   var s = 10;
    //   model.scale.set(s, s, s);
    //   model.castShadow = true;
    //   model.receiveShadow = true;
    //   scene.add(model);
    // }, undefined, function ( error ) {
    //
    //   console.error( error );
    //
    // } );

      // var loader = new GLTFLoader();
    // loader.load('/models/Grass.glb', (gltf) => {
    //   var mesh = gltf.scene.children[4];
    //   // console.log('mesh', gltf);
    //   //
    //   var s = 1;
    //   mesh.scale.set(s, s, s);
    //   mesh.position.x = 0;
    //   mesh.position.y = -20;
    //   mesh.rotation.y = 1.55;
    //   //
    //   // // mesh.castShadow = true;
    //   // // mesh.receiveShadow = true;
    //
    //   // @ts-ignore
    //   scene.add(mesh);
    //
    //   // var mixer = new THREE.AnimationMixer(mesh);
    //   // mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    //   // this.mixers.push(mixer);
    // });
  }

  addSky(engine: GameEngine) {
    this.addLights(engine);

    const scene = engine.getScene();

    const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize( vWorldPosition + offset ).y;
            gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
        }
        `;


    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    // @ts-ignore
    scene.fog = new THREE.Fog(scene.background, 1, 5000);

    var uniforms = {
      "topColor": {value: new THREE.Color(0x0077ff)},
      "bottomColor": {value: new THREE.Color(0xffffff)},
      "offset": {value: 33},
      "exponent": {value: 0.6}
    };
    uniforms["topColor"].value.copy(this.hemiLight.color);

    // @ts-ignore
    scene.fog.color.copy(uniforms["bottomColor"].value);

    var skyGeo = new THREE.SphereBufferGeometry(2000, 32, 15);
    // @ts-ignore
    var skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    // @ts-ignore
    scene.add(sky);

    this.sky = sky;
  }

  addLights(engine: GameEngine) {
    const scene = engine.getScene();

    this.hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(-900, 1000, 100);
    scene.add(this.hemiLight);

    // let hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    // scene.add(hemiLightHelper);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 1);
    this.dirLight.position.set(-901, 1000.75, 100);
    this.dirLight.position.multiplyScalar(30);

    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    // var d = 500;
    // this.dirLight.shadow.camera.left = -d;
    // this.dirLight.shadow.camera.right = d;
    // this.dirLight.shadow.camera.top = d;
    // this.dirLight.shadow.camera.bottom = -d;
    //
    //
    // this.dirLight.shadow.camera.far = 3500;
    // this.dirLight.shadow.bias = -0.0001;
    scene.add(this.dirLight);

    // let dirLightHeper = new THREE.DirectionalLightHelper(this.dirLight, 10);
    // scene.add(dirLightHeper);
  }

  moveX(moveDistance: number) {
    // this.hemiLight.position.x += moveDistance;
    // this.dirLight.position.x += moveDistance;
    this.sky.position.x += moveDistance;
    this.ground.position.x += moveDistance;
  }
}

export default World;
