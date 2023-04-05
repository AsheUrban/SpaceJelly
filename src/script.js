import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Texture

const loader = new THREE.TextureLoader();
const starMap = loader.load("./textures/particles/star.png");

// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(1, 0, 0);
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 15000;
const positionArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * (Math.random() * 7) * (Math.random() * 1);
}

starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.000008,
  // color: "orange", // Sphere Color

});

const starsMaterial = new THREE.PointsMaterial({
  size: 0.008,
  map: starMap,
  transparent: true,
  color: "white", // Star color
  depthWrite: false
});

// 3D Model
let saturn;
// Import the planet saturn model // TODO Change to jelly fish
const gltfLoader = new GLTFLoader(); // Create a loader
gltfLoader.load("/saturn/scene.gltf", (gltf) => {
  console.log("success");

  saturn = gltf.scene.children[0];

  console.log("SATURN HERE", saturn);
  saturn.position.set(0, 0, 0);
  saturn.scale.set(.0001, .0001, .0001);

  scene.add(saturn);
});

// Mesh
const sphere = new THREE.Points(geometry, material);

const starsMesh = new THREE.Points(starsGeometry, starsMaterial);

scene.add(sphere, starsMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 4);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 100;
scene.add(pointLight);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camer
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera

// Base Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(new THREE.Color("#8c8c8c"), 0.7); // background color

// Mouse Movement

document.addEventListener("mousemove", animateStars);
let mouseX = 0;
let mouseY = 0;

function animateStars(event) {

  mouseY = event.clientY;
  mouseX = event.clientX;
}

// Animate

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.15 * elapsedTime;
  starsMesh.rotation.x = -0.1 * elapsedTime;

  if (mouseX > 0) {
    sphere.rotation.y = mouseX * (elapsedTime * -0.00008);
    starsMesh.rotation.y = mouseY * (elapsedTime * 0.0002);
  }

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the frame
  window.requestAnimationFrame(tick);
};

tick();