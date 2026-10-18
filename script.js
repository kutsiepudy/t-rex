const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let enemyHealth = 100;
let gameOver = false;
let enemyState = "idle";
let currentPattern = null;
let attackIndex = 0;
let playerStats = {
  health: 100,
  stamina: 100,
  energy: 0,
  isPunching: false,
  isDodging: false
};
const attackPatterns = [
  ["left", "right", "left", "left"],
  ["left", "right", "left", "right"],
  ["right", "right", "heavyL"],
  ["heavyR", "left", "right"],
]

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (gameOver) return;
  
  if (currentPattern === null) {
    chooseAttackPattern();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0,  canvas.width, canvas.height);
  
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(350, 150, 100, 200);

  ctx.fillStyle = "#555";
  ctx.fillRect(350, 120, 100, 12);

  ctx.fillStyle = "#2ed573";
  ctx.fillRect(350, 120, enemyHealth, 12);
  
  if (enemyHealth <= 0) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TIPPED OVER!!!", canvas.width / 2, 80)
  }
 }

window.addEventListener("keydown", (e) => {
  if (playerStats.isDodging || playerStats.isPunching) return;
  
  switch (e.key) {
    case "ArrowLeft":
      console.log("dodged left");
      break;
      
    case "ArrowRight":
      console.log("dodged right");
      break;
      
    case "z":
      triggerPlayerPunch("left");
      console.log("left")
      break;
      
    case "x":
      triggerPlayerPunch("right");
      console.log("right")
      break;
  }
});

function endGame() {
  console.log("GAME OVER");
  gameOver = true;
}

function triggerPlayerPunch(side) {
  if (gameOver || enemyHealth <= 0) return;
  if (playerStats.isPunching || playerStats.isDodging) return;
  
  playerStats.isPunching = true;

  enemyHealth = Math.max(0, enemyHealth - 10);
  console.log(side + " punch", "Enemy Health is", enemyHealth);
  
  if (enemyHealth === 0) {
    endGame();
  }
  
  setTimeout(() => {
    playerStats.isPunching = false;
  }, 250);
};

function chooseAttackPattern() {
  const index = Math.floor(Math.random() * attackPatterns.length);
  
  currentPattern = attackPatterns[index];
  attackIndex = 0;
  
  console.log("chosen pattern: ", currentPattern);
}

gameLoop();
