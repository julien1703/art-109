import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('scene-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1219);

const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3.2, 2.2, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.6, -0.2);

const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1d27, 0.9);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.8);
dir.position.set(4, 7, 3);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
dir.shadow.camera.near = 0.1;
dir.shadow.camera.far = 30;
scene.add(dir);

const rim = new THREE.SpotLight(0x88b4ff, 0.8, 25, Math.PI/7, 0.35, 1);
rim.position.set(-6, 5, -4);
rim.castShadow = true;
scene.add(rim);

const texLoader = new THREE.TextureLoader();
const checker = texLoader.load('./textures/checker.png');
checker.wrapS = checker.wrapT = THREE.RepeatWrapping;
checker.anisotropy = 8;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ map: checker, metalness: 0.1, roughness: 0.8 })
);
cube.position.set(-1.5, 0.5, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 48, 48),
  new THREE.MeshStandardMaterial({ color: 0x44aa88, roughness: 0.35, metalness: 0.05 })
);
sphere.position.set(1.5, 0.6, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.95 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

let ufo = null;
const loader = new GLTFLoader();
loader.load(
  './models/UFO.glb',
  (gltf) => {
    ufo = gltf.scene;
    ufo.position.set(0, 0.8, -1.5);
    ufo.scale.set(0.5, 0.5, 0.5);
    ufo.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }});
    scene.add(ufo);
  },
  undefined,
  (e) => console.error(e)
);

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  cube.rotation.y = t * 0.8;
  sphere.rotation.y = t * 0.5;
  if (ufo) ufo.position.y = 0.8 + Math.sin(t * 1.6) * 0.12;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
