import "./style.css";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
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
  100000 // Far clipping distance limit
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

// Controls
const controls = new PointerLockControls(camera, canvas);
controls.enableDamping = false; // use to give a sense of weight
controls.constrainVertical = true;
addEventListener(
  'click',
  function () {
      controls.lock()
  },
  false
)

// Particles
const particlesGeometry = new THREE.BufferGeometry(); // Geometry for stars
const particlesCount = 50000; // particles to be created. Is equiv to 5000 * 3 (x,y,z vertices)
const vertices = new Float32Array(particlesCount); // float of 32 bits (from buffer geo - vertices arr[x, y, z])

// loop through all arr[x,y,z] w for loop (rand position)
for( let i = 0; i < particlesCount; i++)
{
  vertices[i] = (Math.random() - 0.5) * 50;// mult (Math.rand - 0.5 to +.5)by 100; Range -50 through +50
}
particlesGeometry.setAttribute(
  "position", 
  new THREE.BufferAttribute(vertices, 3) // stores data ie. vertices position, custom attributes// 3 vals [xyz] per docs
)

// Texture (loader fxn)
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/bubble.png"); // TODO // Adds particle textures

// Material
const particlesMaterial = new THREE.PointsMaterial({
  map: particleTexture, // Texture
  size: .6, // size of particles
  sizeAttenuation: true, //bool// particle sz gets smaller (val:0-3) as the camera zooms out & vice versa
  transparent: true,
  depthWrite: false
});

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

const gltfLoader = new GLTFLoader(); // Create a loader
let sun;

// make async loader
const loadAsync = url => {
  return new Promise(resolve => {
    gltfLoader.load(url, gltf => {
      resolve(gltf)
    })
  })
}
Promise.all( [loadAsync('./sun/scene.gltf'), loadAsync('./jellyfish/scene.gltf')] ).then(models => {
  // get what you need from the models array
  const sun = models[0].scene.children[0]
    sun.position.set(-15, 0, 0);
    sun.scale.set(0.1, 0.1, 0.1);
  const jf = models[1].scene.children[0]
    jf.position.set(5, 0, 0);
    jf.scale.set(0.01, 0.01, 0.01);

    console.log("sun", sun);
  // add both models to the scene

  scene.add(sun)
  scene.add(jf)
})

// let saturn;
// // Import the planet saturn model // TODO Change to jelly fish
// const gltfLoader = new GLTFLoader(); // Create a loader
// gltfLoader.load("/scene.gltf", (gltf) => {
//   console.log("success");

//   saturn = gltf.scene.children[0];

//   console.log("SATURN HERE", saturn);
//   saturn.position.set(0, 0, 0);
//   saturn.scale.set(.0001, .0001, .0001);

//   scene.add(saturn);
// });

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // Canvas is the canvas element from html
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Avoid pixelation on high res screens

// Animate
const animate = () => {
    // // Update the controls
    // controls.update(1);

    //Render the scene
    renderer.render(scene, camera);

    //Calls itself next frame, to repeat
    window.requestAnimationFrame(animate);
};

animate();

