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
const starsCount = 1500;
const positionArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * (Math.random() * 20) * (Math.random() * 1);
}

starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.00008,
  // color: "orange", // Sphere Color

});

const starsMaterial = new THREE.PointsMaterial({
  size: 0.01,
  map: starMap,
  transparent: true,
  color: "white", // Star color
  depthWrite: false
});

// 3D Model
const gltfLoader = new GLTFLoader(); // Create a loader
let saturn;
let sun;
let jellyfish;

gltfLoader.load('./saturn/scene.gltf', gltf => {
  saturn = gltf.scene.children[0];
  saturn.scale.set(0.0001, 0.0001, 0.0001);
  scene.add(saturn);
});

gltfLoader.load('./sun/scene.gltf', gltf => {
  sun = gltf.scene.children[0];
  sun.position.set(0, 0, 0);
  sun.scale.set(0.025, 0.025, 0.025);
  scene.add(sun);
});

gltfLoader.load('./jellyfish/scene.gltf', gltf => {
  jellyfish = gltf.scene.children[0];
  jellyfish.scale.set(0.05, 0.05, 0.05);
  scene.add(jellyfish);
});

// Multiply models
// const numJellies = 3; // The number of Saturns you want to create
// const jellies = []; // An array to hold the Saturn objects

// for (let i = 0; i < numJellies; i++) {
//   const newJelly = jellyfish.clone(); // Clone the original Saturn object
//   newJelly.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5); // Set a random position for the new Saturn
//   jellies.push(newJelly); // Add the new Saturn to the array
//   scene.add(newJelly); // Add the new Saturn to the scene
// }

// Mesh
const sphere = new THREE.Points(geometry, material);

const starsMesh = new THREE.Points(starsGeometry, starsMaterial);

scene.add(sphere, starsMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 4);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;
scene.add(pointLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambient)

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
  alpha: true,
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

  if(saturn != null){ 
    saturn.rotation.x = 0.55;
    saturn.position.set(
      0.5, Math.cos(elapsedTime) * 3.5,  Math.sin(elapsedTime) * 1.75
    );
   }

  if(sun != null){ sun.rotation.z += .005; }

  if(jellyfish != null){
    jellyfish.rotation.z = -1 * elapsedTime;
    jellyfish.rotation.y = (Math.PI / -2) * (0.64 * elapsedTime);
    jellyfish.rotation.x = 0;
    jellyfish.position.set(
    Math.cos(elapsedTime) * 1.5, 0, Math.sin(elapsedTime) * 1.5
    );
  }

  // Update objects
  sphere.rotation.x = 0.05 * elapsedTime;
  starsMesh.rotation.y = -0.1 * elapsedTime;

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