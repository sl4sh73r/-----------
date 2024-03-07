"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/addons/controls/OrbitControls.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

document.addEventListener("DOMContentLoaded", function () {
  // Получаем цвета из CSS
  var canvas = document.querySelector(".sphereCanvas");
  var style = window.getComputedStyle(canvas);
  var color1 = style.getPropertyValue("--sphere-color1").trim();
  var color2 = style.getPropertyValue("--sphere-color2").trim();
  var ringcolor = style.getPropertyValue("--ring-color").trim(); // Создаем сцену

  var scene = new THREE.Scene(); // Создаем камеру

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5; // Создаем рендерер с прозрачным фоном

  var renderer = new THREE.WebGLRenderer({
    alpha: true
  }); // Устанавливаем размер рендерера

  renderer.setSize(750, 350);
  document.getElementById("sphereContainer").appendChild(renderer.domElement); // Создаем геометрию шара

  var geometry = new THREE.SphereGeometry(2, 325, 325); // Создаем градиент на 2D канвасе

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height); // Создаем текстуру из канваса

  var texture = new THREE.CanvasTexture(canvas); // Создаем материал с градиентом

  var material = new THREE.MeshPhongMaterial({
    map: texture,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
  }); // Создаем источник света

  var light = new THREE.DirectionalLight(0xffffff, 1); // свет с направлением

  scene.add(light); // Создаем дополнительный источник света

  var pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight); // Создаем шар

  var sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true; // позволяем сфере создавать тени

  scene.add(sphere); // Создаем OrbitControls и связываем его с камерой и элементом рендерера

  var controls = new _OrbitControls.OrbitControls(camera, renderer.domElement); // Устанавливаем цель OrbitControls на сферу

  controls.target.set(sphere.position.x, sphere.position.y, sphere.position.z); // Включаем инерцию

  controls.enableDamping = true;
  controls.dampingFactor = 0.05; // Создаем канвас для текстуры ареолы

  var glowCanvas = document.createElement("canvas");
  glowCanvas.width = 128;
  glowCanvas.height = 128;
  var glowContext = glowCanvas.getContext("2d"); // Создаем радиальный градиент

  var glowGradient = glowContext.createRadialGradient(glowCanvas.width / 2, glowCanvas.height / 2, 0, glowCanvas.width / 2, glowCanvas.height / 2, glowCanvas.width / 2);
  glowGradient.addColorStop(0, "rgba(0, 0, 0, 0)"); //   glowGradient.addColorStop(0.40, 'rgba(0, 0, 0, 0)');

  glowGradient.addColorStop(0.4, color1);
  glowGradient.addColorStop(0.5, color2);
  glowGradient.addColorStop(0.6, "rgba(0, 0, 0, 0)");
  glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Применяем градиент

  glowContext.fillStyle = glowGradient;
  glowContext.fillRect(0, 0, glowCanvas.width, glowCanvas.height); // Создаем текстуру из канваса

  var glowTexture = new THREE.CanvasTexture(glowCanvas); // Создаем материал для ареолы

  var glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0.4 // делаем ареолу полупрозрачной

  }); // Создаем ареолу как спрайт

  var glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(10, 10, 1); // увеличиваем размер спрайта

  scene.add(glow); // Создаем функцию для вычисления цвета ареолы на основе угла поворота сферы

  function computeGlowColor(rotation) {
    var t = (Math.sin(rotation) + 1) / 2; // вычисляем t в диапазоне от 0 до 1

    var skyBlue = new THREE.Color(color1); // RGB для небесно-голубого

    var darkviolet = new THREE.Color(color2); // RGB для фиолетово-неонового

    var color = new THREE.Color();
    color.r = THREE.MathUtils.lerp(skyBlue.r, darkviolet.r, t);
    color.g = THREE.MathUtils.lerp(skyBlue.g, darkviolet.g, t);
    color.b = THREE.MathUtils.lerp(skyBlue.b, darkviolet.b, t);
    return color;
  } // Создаем геометрию для колец


  var ringGeometry1 = new THREE.TorusGeometry(2.5, 0.02, 160, 1000);
  var ringGeometry2 = new THREE.TorusGeometry(2.75, 0.05, 160, 1000); // Создаем материал для колец

  var ringMaterial = new THREE.MeshBasicMaterial({
    color: ringcolor,
    side: THREE.DoubleSide
  }); // Создаем кольца

  var ring1 = new THREE.Mesh(ringGeometry1, ringMaterial);
  var ring2 = new THREE.Mesh(ringGeometry2, ringMaterial); // Поворачиваем кольца, чтобы они были перпендикулярны оси Y

  ring1.rotation.x = Math.PI / 2;
  ring2.rotation.x = Math.PI / 2; // Добавляем кольца на сцену

  scene.add(ring1);
  scene.add(ring2); // В функции анимации добавляем вращение кольцам

  function animate() {
    requestAnimationFrame(animate);
    light.position.copy(camera.position); // обновляем позицию света, чтобы она соответствовала позиции камеры

    sphere.rotation.y += 0.001; // добавляем вращение вокруг оси Y

    sphere.rotation.x += 0.005; // добавляем вращение вокруг оси Y

    glow.position.copy(sphere.position); // обновляем позицию ареолы, чтобы она соответствовала позиции сферы

    glow.material.color = computeGlowColor(sphere.rotation.y * 9); // обновляем цвет ареолы
    // Добавляем вращение кольцам

    ring1.rotation.y += 0.005;
    ring2.rotation.y += 0.0015; // Обновляем позицию частиц, чтобы они двигались от колец
    // particleSystem.children.forEach(function(particle) {
    //     particle.position.x += ring1.position.x +  (Math.random() - 0.5) * 0.02;
    //     particle.position.y += ring1.position.y +  (Math.random() - 0.5) * 0.02;
    //     particle.position.z += ring1.position.z +  (Math.random() - 0.5) * 0.02;
    // });

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
});