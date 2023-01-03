console.log("Init");

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import model from "./assets/models/scene.gltf?url";

const settings = {
  width: window.innerWidth,
  height: window.innerHeight,
  ratio: window.innerWidth / window.innerHeight,
};

console.log(settings);

const canvas = document.querySelector("#pepitos");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, settings.ratio, 1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3());
camera.updateProjectionMatrix();

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

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
);
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(model, (model) => {
  model.scene.scale.set(0.1, 0.1, 0.1);
  model.scene.position.set(0, -5, 0);

  scene.add(model.scene);
});

const animate = function (time) {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};

animate();
