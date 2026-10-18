const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let enemyHealth = 100;
let gameOver = false;
let enemyState = "idle";
let currentPattern = null;
let attackIndex = 0;
let enemyTimer = 0;
let currentAttack = null;
let gameStarted = false;
let countdownTimer = 0;
let countdown = 3;
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

  if (!gameStarted) {
    countdownTimer++;

    if (countdownTimer >= 60) {
      countdown--;
      countdownTimer = 0;
    }

    if (countdown <= 0) {
      gameStarted = true;
      console.log("FIGHT!");
    }

    return;
  }

  if (currentPattern === null) {
    chooseAttackPattern();
    return;
  }

  enemyTimer--;

  if (enemyTimer > 0) return;

  switch (enemyState) {
    case "idle":
      currentAttack = currentPattern[attackIndex];
      enemyState = "telegraph";
      enemyTimer = 45;
      console.log("Incoming:", currentAttack);
      break;

    case "telegraph":
      enemyState = "punching";
      enemyTimer = 20;
      playerStats.health = Math.max(0, playerStats.health - 10);
      console.log("T-REX ATTACKS:", currentAttack);
      console.log("HEALTH:", playerStats.health);
      
      if (playerStats.health <= 0) {
        endGame();
      }
      break;

    case "punching":
      enemyState = "idle";
      enemyTimer = 30;
      attackIndex++;

      if (attackIndex >= currentPattern.length) {
        currentPattern = null;
      }
      break;
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
  
  ctx.fillStyle = "#555";
  ctx.fillRect(50, 120, 100, 12);
  
  ctx.fillStyle = "#2ed573";
  ctx.fillRect(50, 120, playerStats.health, 12);
  
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PLAYER HP", 50, 110);
  
  if (enemyHealth <= 0) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      enemyHealth <= 0 ? "TIPPED OVER" : "GAME OVER",
      canvas.width / 2,
      80
    );
  };
  
  if (!gameStarted) {
    ctx.fillStyle = "#fff";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      countdown > 0 ? countdown : "FIGHT!",
      canvas.width / 2,
      80
    );
  };
 }

window.addEventListener("keydown", (e) => {
  if (!gameStarted || gameOver) return;
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

function endGame(result = "lose") {
  console.log(result === "win" ? "YOU WIN" : "YOU LOSE");
  gameOver = true;
}

function triggerPlayerPunch(side) {
  if (gameOver || enemyHealth <= 0) return;
  if (playerStats.isPunching || playerStats.isDodging) return;
  
  playerStats.isPunching = true;

  enemyHealth = Math.max(0, enemyHealth - 10);
  console.log(side + " punch", "Enemy Health is", enemyHealth);
  
  if (enemyHealth === 0) {
    endGame("win");
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
