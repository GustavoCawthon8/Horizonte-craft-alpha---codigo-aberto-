const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 12);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);

// Sistema de mover a câmera pelo jogo
/*
const controls = new THREE.OrbitControls(camera, 
renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
*/
// Carregar a textura
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("texture/grama.png");

// Criar geometria e material dos cubos
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ map: texture });

const cubos = [];

// Função para adicionar cubos em uma grade
function addCubes(numCubes) {
  const gridSize = Math.ceil(Math.sqrt(numCubes));
  const cubeSize = 1;
  const spacing = cubeSize;

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      if (cubos.length >= numCubes) break;

      const position = new THREE.Vector3(
        x * spacing - (gridSize * spacing) / 2 + cubeSize / 2, // Centraliza a grade
        cubeSize / 2, // Altura do cubo
        z * spacing - (gridSize * spacing) / 2 + cubeSize / 2
      );

      const box = new THREE.Mesh(geometry, material);
      box.position.copy(position);
      scene.add(box);
      cubos.push(box);
      box.receiveShadow = true
    }
  }
}
addCubes(400);

let trees = []
let sheets = []

//criando arvore no mapa
const trukeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
const trukeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

const leaveGeometry = new THREE.SphereGeometry(1);
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
for (let i = 0; i < 40; i++) {

  const truke = new THREE.Mesh(trukeGeometry, trukeMaterial);
  const leaves = new THREE.Mesh(leaveGeometry, leavesMaterial);
truke.castShadow = true
leaves.castShadow = true

  


  const xPos = Math.random() * 10 - 5;
  const zPos = Math.random() * 10 - 10;
  truke.position.set(xPos, 2, zPos)
  leaves.position.set(xPos, 3, zPos)

  scene.add(leaves);
  scene.add(truke);
  trees.push(truke)
  sheets.push(leaves)
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)
directionalLight.castShadow = true

// sistema de quebrar a arvore{
function checkProximity() {
  const playerPosition = new THREE.Vector3();
  camera.getWorldPosition(playerPosition);

  let foundTree = false; // Variável para verificar se encontramos uma árvore

  trees.forEach(tree => {
    const distance = playerPosition.distanceTo(tree.position);

    // Verifica a distância entre o jogador e a árvore
    if (distance < 2) {
      foundTree = true;
      showCutButton(tree);
    }
  });

  if (!foundTree) {
    hideCutButton();
  }
}

let isCutting = false;
let cuttingTree = null;

function showCutButton(tree) {
  const cutButton = document.getElementById("cutButton");

  // Evita mostrar o botão se já esta cortando
  if (!isCutting) {
    cutButton.style.display = "block";

    cutButton.onclick = () => {
      startCutting(tree);
    };
  }
}

function hideCutButton() {
  const cutButton = document.getElementById("cutButton");
  cutButton.style.display = "none";
}

function startCutting(tree) {
  isCutting = true;
  cuttingTree = tree;

  const cutButton = document.getElementById("cutButton");
  cutButton.innerText = "Cortando...";

  setTimeout(() => {
    finishCutting();
  }, 3000);
}

function finishCutting() {
  isCutting = false;

  if (cuttingTree) {
    cuttingTree.rotation.x = Math.PI / 2;
    cuttingTree.position.y = 1.2;
    scene.remove(sheets)
    // Remove a árvore após 5 segundos
    setTimeout(() => {
      scene.remove(cuttingTree);
      scene.remove(sheets)
    }, 5000);
  }

  const cutButton = document.getElementById("cutButton");
  cutButton.innerText = "Cortar";
  cuttingTree = null;
}
// fim do sistema de quabrar a arvore }
// sistema de inventário{

const axesHelper = new THREE.AxesHelper(6);
scene.add(axesHelper)


// fim do sistema de inventario}

//criando as nuvens
const cloudGeometry = new THREE.BoxGeometry(10, 1, 4);
const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
let clouds = []

for (let i = 0; i < 200; i++) {
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  const xPos = Math.random() * 200 - 100;
  const yPos = 15;
  const zPos = Math.random() * 200 - 100;
  cloud.position.set(xPos, yPos, zPos);

  scene.add(cloud)
  clouds.push(cloud)
  cloud.castShadow = true
}


function moveCloud() {
  clouds.forEach(cloud => {
    cloud.position.x += 0.01;
    if (cloud.position.x >= 100) {
      cloud.position.x = -100
    }

  })
}

// criando player 
// sistema da camera
let isDragging = false;
let previousTouchX = 0;
let previousTouchY = 0;
const rotationSpeed = 0.02;
let yaw = 0;
let pitch = 0;
const maxPitch = Math.PI / 2;

/*
importando essa variavel para outro script 
script.js
*/
export { isDragging };
// main.js

export const setDragging = (value) => {
  isDragging = value;
};

export const getDragging = () => {
  return isDragging;
};
// ===

camera.rotation.order = 'YXZ';

document.addEventListener("touchstart", (event) => {
  isDragging = true;
  previousTouchX = event.touches[0].clientX;
  previousTouchY = event.touches[0].clientY;
});

document.addEventListener("touchmove", (event) => {
  if (isDragging) {
    const currentTouchX = event.touches[0].clientX;
    const currentTouchY = event.touches[0].clientY;

    const deltaX = currentTouchX - previousTouchX;
    const deltaY = currentTouchY - previousTouchY;

    yaw -= deltaX * rotationSpeed;
    pitch -= deltaY * rotationSpeed;

    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));

    camera.rotation.set(pitch, yaw, 0);

    previousTouchX = currentTouchX;
    previousTouchY = currentTouchY;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});
// Sistema do joystick
const playerSpeed = 0.1;
const joystick = document.getElementById("joystick");
const handle = document.getElementById("handle");
let moveX = 0;
let moveZ = 0;

// Movimentação do joystick
joystick.addEventListener("touchmove", (evt) => {
  const touch = evt.touches[0];
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  moveX = (touch.clientX - centerX) / 50;
  moveZ = (touch.clientY - centerY) / 50;

  moveX = Math.max(-1, Math.min(1, moveX));
  moveZ = Math.max(-1, Math.min(1, moveZ));

  handle.style.transform = `translate(${moveX * 30}px, ${moveZ * 30}px)`;
  isDragging = false
});

joystick.addEventListener("touchend", () => {
  moveX = 0;
  moveZ = 0;
  isDragging = true
  handle.style.transform = "translate(0px, 0px)";
});

// Função para mover o jogador de acordo com a direção da câmera
function movePlayerCamera() {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Vetor de movimento com base na rotação da câmera
  const moveDirection = new THREE.Vector3();
  moveDirection.x = direction.x * -moveZ * playerSpeed;
  moveDirection.z = direction.z * -moveZ * playerSpeed;

  camera.position.x += moveDirection.x + moveX * playerSpeed;
  camera.position.z += moveDirection.z + moveX * playerSpeed;
}
// fim da criação do player

//==={
// Criação do Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Função para detectar cubos de grama
function detectGrassCube() {
  raycaster.setFromCamera(pointer, camera);


  const intersects = raycaster.intersectObjects(cubos);

  if (intersects.length > 0) {
    const intersectedCube = intersects[0].object;
    const attackButton = document.querySelector('#btnUtility button:nth-child(2)'); 
    attackButton.addEventListener('click', () => {
      placeRedCube(intersectedCube);
    });
  }
}

function placeRedCube(grassCube) {
  const redGeometry = new THREE.BoxGeometry()
  const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const redCube = new THREE.Mesh(redGeometry, redMaterial);
  
  // Posiciona o cubo vermelho exatamente sobre o cubo de grama
  redCube.position.set(grassCube.position.x, grassCube.position.y + 1, grassCube.position.z);
  scene.add(redCube);
}

// Atualiza a posição do pointer para o centro da tela (pode mudar se for touch/mouse)
pointer.set(0, 0);

//===}

function animate() {
  requestAnimationFrame(animate);
  //controls.update();
  moveCloud()
  movePlayerCamera()
  checkProximity()
  detectGrassCube()
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});