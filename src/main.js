console.log("Init");

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import model from "./assets/models/scene.gltf?url";
import fragmentShader from "./assets/shaders/frag.glsl?raw";
import vertexShader from "./assets/shaders/vertex.glsl?raw";

const settings = {
  width: window.innerWidth,
  height: window.innerHeight,
  ratio: window.innerWidth / window.innerHeight,
  isMobile: window.matchMedia("only screen and (max-width: 768px)").matches,
};

console.log(settings);

const canvas = document.querySelector("#pepitos");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, settings.ratio, 1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3());
camera.updateProjectionMatrix();

if (settings.isMobile) {
  camera.position.z = 15;
}

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(settings.width, settings.height);
renderer.outputEncoding = THREE.sRGBEncoding;

const ambientLight = new THREE.AmbientLight("#fff", 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#fff", 1);
directionalLight.position.set(1);

const uniforms = {
  uDirectionalLight: { value: new THREE.Vector3(-191, 1, 1) },
};
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
);
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(model, (model) => {
  model.scene.scale.set(0.1, 0.1, 0.1);
  model.scene.position.set(0, -5, 0);

  model.scene.traverse((o) => {
    if (o.isMesh) o.material = material;
  });

  scene.add(model.scene);
});

const animate = function (time) {
  requestAnimationFrame(animate);

  directionalLight.position.x = Math.sin(time / 1500) * -2;
  directionalLight.position.y = Math.sin(time / 1500) * 1.5;
  //directionalLight.position.z = Math.tan(time / 1000) * 2;

  uniforms.uDirectionalLight.value.x = directionalLight.position.x;
  uniforms.uDirectionalLight.value.y = directionalLight.position.y;
  //uniforms.uDirectionalLight.value.z = directionalLight.position.z;

  controls.update();
  renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
