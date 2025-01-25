const svg = document.querySelector('.game-viewport');
const gameWorld = document.querySelector('.game-world');
const player = document.querySelector('.player');
const enemiesContainer = document.querySelector('.enemies');
const healthBar = document.querySelector('.current-health');
const scoreElement = document.querySelector('.score');

let playerPos = { x: 300, y: 300 };
let velocity = { x: 0, y: 0 };
let health = 100;
let score = 0;
const enemies = [];
const ENEMY_COUNT = 6;
const CELL_SIZE = 40;

// Generate dungeon layout
function generateDungeon() {
  for(let x = 0; x < 15; x++) {
    for(let y = 0; y < 15; y++) {
      if(Math.random() < 0.3 && (x !== 7 || y !== 7)) {
        const wall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        wall.setAttribute('x', x * CELL_SIZE);
        wall.setAttribute('y', y * CELL_SIZE);
        wall.setAttribute('width', CELL_SIZE-2);
        wall.setAttribute('height', CELL_SIZE-2);
        wall.setAttribute('fill', '#444');
        gameWorld.appendChild(wall);
      }
    }
  }
}

function createEnemy() {
  const enemy = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  enemy.setAttribute('class', 'enemy');
  enemy.setAttribute('r', '10');
  return enemy;
}

function spawnEnemies() {
  for(let i = 0; i < ENEMY_COUNT; i++) {
    const enemy = {
      element: createEnemy(),
      x: Math.random() * 600,
      y: Math.random() * 600,
      speed: 1.5
    };
    enemiesContainer.appendChild(enemy.element);
    enemies.push(enemy);
  }
}

function updatePositions() {
  // Player movement
  playerPos.x += velocity.x;
  playerPos.y += velocity.y;
  
  // Update viewport transform
  const viewX = -playerPos.x + 200;
  const viewY = -playerPos.y + 200;
  gameWorld.setAttribute('transform', `translate(${viewX},${viewY})`);
  
  // Update enemies
  enemies.forEach(enemy => {
    const dx = playerPos.x - enemy.x;
    const dy = playerPos.y - enemy.y;
    const angle = Math.atan2(dy, dx);
    
    enemy.x += Math.cos(angle) * enemy.speed/2;
    enemy.y += Math.sin(angle) * enemy.speed/2;
    enemy.element.setAttribute('cx', enemy.x);
    enemy.element.setAttribute('cy', enemy.y);
    
    // Collision detection
    const dist = Math.hypot(playerPos.x - enemy.x, playerPos.y - enemy.y);
    if(dist < 22) {
      health -= 0.5;
      healthBar.style.width = health + '%';
      if(health <= 0) {
        alert('Game Over! Score: ' + score);
        location.reload();
      }
    }
  });
}

window.addEventListener('keydown', (e) => {
  const speed = 4;
  switch(e.key) {
    case 'ArrowUp': velocity.y = -speed; break;
    case 'ArrowDown': velocity.y = speed; break;
    case 'ArrowLeft': velocity.x = -speed; break;
    case 'ArrowRight': velocity.x = speed; break;
  }
});

window.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'ArrowUp':
    case 'ArrowDown': velocity.y = 0; break;
    case 'ArrowLeft':
    case 'ArrowRight': velocity.x = 0; break;
  }
});

function gameLoop() {
  updatePositions();
  requestAnimationFrame(gameLoop);
  
  // Random score increase
  if(Math.random() < 0.1) {
    score += 10;
    scoreElement.textContent = `SCORE: ${score}`;
  }
}

// Start game
generateDungeon();
spawnEnemies();
gameLoop();