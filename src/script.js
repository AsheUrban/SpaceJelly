import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // FOV - Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio - might need to be innerHeight/innerHeight
  0.1, // Near clipping distance limit
  1000 // Far clipping distance limit
);
camera.position.z = 3; // Pull the camera back a bit so you can see the object
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2);  // Create a basic white universal light  // TODO: Change this to a fancier light!
ambientLight.position.set(0, 0, 0); // Set position of the light
scene.add(ambientLight); 

const pointLight = new THREE.PointLight(0xffffff, 2); // Create a point light
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Particles
const particleGeometry = new THREE.BufferGeometry; // Geometry for stars
const particlesCount = 15000; // particles to be created. Is equiv to 5000 * 3 (x,y,z vertices)
const vertices = new Float32Array(particlesCount); // float of 32 bits (from buffer geo - vertices arr[x, y, z])

// loop through all arr[x,y,z] w for loop (rand position)
for( let i = 0; i < particlesCount; i++)
{
  vertices[i] = (Math.random() - 0.5) * 100;// mult (Math.rand - 0.5 to +.5)by 100; Range -50 through +50
  
}

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // Canvas is the canvas element from html
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Avoid pixelation on high res screens

// Animate
const animate = () => {
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
};

animate();

