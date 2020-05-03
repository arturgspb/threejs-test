import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Engine {

    private container: HTMLElement;

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: any;
    private dirLight: any;
    private dirLightHeper: any;
    private hemiLight: any;
    private hemiLightHelper: any;
    private mixers = [];
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

        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        // @ts-ignore
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        // LIGHTS

        this.hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);

        this.hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
        this.scene.add(this.hemiLightHelper);

        //

        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(-1, 1.75, 1);
        this.dirLight.position.multiplyScalar(30);
        this.scene.add(this.dirLight);

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
        this.scene.add(this.dirLightHeper);

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

        // SKYDOME
        // @ts-ignore
        // var vertexShader = document.getElementById('vertexShader').textContent;
        // @ts-ignore
        // var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            "topColor": {value: new THREE.Color(0x0077ff)},
            "bottomColor": {value: new THREE.Color(0xffffff)},
            "offset": {value: 33},
            "exponent": {value: 0.6}
        };
        uniforms["topColor"].value.copy(this.hemiLight.color);

        // @ts-ignore
        this.scene.fog.color.copy(uniforms["bottomColor"].value);

        var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        // @ts-ignore
        var skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            // vertexShader: vertexShader,
            // fragmentShader: fragmentShader,
            side: THREE.BackSide
        });

        var sky = new THREE.Mesh(skyGeo, skyMat);
        // @ts-ignore
        this.scene.add(sky);

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
            // @ts-ignore
            this.mixers.push(this.mixer);
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
        var delta = this.clock.getDelta();
        for (var i = 0; i < this.mixers.length; i++) {
            // @ts-ignore
            // this.mixers[i].update(delta);
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

        var bounds = {
            xMin: this.HERO.position.x - H_width / 2,
            xMax: this.HERO.position.x + H_width / 2,
            yMin: this.HERO.position.y - H_height / 2,
            yMax: this.HERO.position.y + H_height / 2,
            zMin: this.HERO.position.z - H_width / 2,
            zMax: this.HERO.position.z + H_width / 2,
        };

        // Run through each object and detect if there is a collision.
        for (var index = 0; index < this.collisions.length; index++) {
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