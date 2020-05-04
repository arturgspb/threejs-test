import Engine from "./engine";
import * as THREE from "three";

class World {

  private dirLight: any;
  private hemiLight: any;
  private ground: any;
  private sky: any;

  addGround(engine: Engine) {
    const scene = engine.getScene();

    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshLambertMaterial({color: 0xffffff});
    groundMat.color.setHSL(0.095, 1, 0.75);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    // @ts-ignore
    scene.add(ground);

    this.ground = ground;
  }

  addSky(engine: Engine) {
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

  addLights(engine: Engine) {
    const scene = engine.getScene();

    this.hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(-900, 50, 0);
    scene.add(this.hemiLight);

    // let hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    // scene.add(hemiLightHelper);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-901, 1.75, 10);
    this.dirLight.position.multiplyScalar(30);
    scene.add(this.dirLight);

    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    var d = 50;

    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;

    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = -0.0001;

    // let dirLightHeper = new THREE.DirectionalLightHelper(this.dirLight, 10);
    // scene.add(dirLightHeper);
  }

  moveX(moveDistance: number) {
    this.hemiLight.position.x += moveDistance;
    this.dirLight.position.x += moveDistance;
    this.sky.position.x += moveDistance;
    this.ground.position.x += moveDistance;
  }
}

export default World;
