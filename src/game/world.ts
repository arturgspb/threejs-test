import Engine from "./engine";
import * as THREE from "three";

class World {

  private dirLight: any;
  private dirLightHeper: any;
  private hemiLight: any;
  private hemiLightHelper: any;

  addSky(engine: Engine) {
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

    // LIGHTS

    this.hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 50, 0);
    scene.add(this.hemiLight);

    this.hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    scene.add(this.hemiLightHelper);

    //

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-1, 1.75, 1);
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

    this.dirLightHeper = new THREE.DirectionalLightHelper(this.dirLight, 10);
    scene.add(this.dirLightHeper);

    var uniforms = {
      "topColor": {value: new THREE.Color(0x0077ff)},
      "bottomColor": {value: new THREE.Color(0xffffff)},
      "offset": {value: 33},
      "exponent": {value: 0.6}
    };
    uniforms["topColor"].value.copy(this.hemiLight.color);

    // @ts-ignore
    engine.getScene().fog.color.copy(uniforms["bottomColor"].value);

    var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
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
  }
}

export default World;
