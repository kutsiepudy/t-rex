
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bigRex = new Image();
bigRex.src = "big-rex/idle.jpg";

const lilRex = new Image();
lilRex.src = "lil-rex/idleP.jpg";

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
  isDodging: false,
  dodgeDirection: null
};

const attackPatterns = [
  ["left", "right", "left", "left"],
  ["left", "right", "left", "right"],
  ["right", "right", "heavyL"],
  ["heavyR", "left", "right"]
];

const damage = {
  left: 10,
  right: 10,
  heavyR: 15,
  heavyL: 15
};

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
      enemyTimer = 60;
      break;

    case "telegraph": {
      enemyState = "punching";
      enemyTimer = 20;

      const attackDamage = damage[currentAttack];

      const attackDirection = currentAttack.endsWith("L")
        ? "left"
        : currentAttack.endsWith("R")
        ? "right"
        : currentAttack;

      const dodgedCorrectly =
        playerStats.isDodging &&
        playerStats.dodgeDirection === attackDirection;

      if (!dodgedCorrectly) {
        playerStats.health = Math.max(
          0,
          playerStats.health - attackDamage
        );
      }

      if (playerStats.health <= 0) {
        endGame();
      }

      break;
    }

    case "punching":
      enemyState = "idle";
      enemyTimer = 45;
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
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bigRex.complete && bigRex.naturalWidth > 0) {
    ctx.drawImage(bigRex, 350, 150, 100, 200);
  }

  if (lilRex.complete && lilRex.naturalWidth > 0) {
    ctx.drawImage(lilRex, 80, 150, 100, 200);
  }

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

  if (gameOver) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      enemyHealth <= 0 ? "TIPPED OVER!!!" : "GAME OVER",
      canvas.width / 2,
      80
    );
  }

  if (!gameStarted) {
    ctx.fillStyle = "#fff";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      countdown > 0 ? countdown : "FIGHT!",
      canvas.width / 2,
      80
    );
  }
}

window.addEventListener("keydown", (e) => {
  if (!gameStarted || gameOver) return;
  if (playerStats.isDodging || playerStats.isPunching) return;

  switch (e.key) {
    case "ArrowLeft":
      startDodge("left");
      break;

    case "ArrowRight":
      startDodge("right");
      break;

    case "z":
    case "Z":
      triggerPlayerPunch("left");
      break;

    case "x":
    case "X":
      triggerPlayerPunch("right");
      break;
  }
});

function endGame(result = "lose") {
  gameOver = true;
}

function triggerPlayerPunch(side) {
  if (gameOver || enemyHealth <= 0) return;
  if (playerStats.isPunching || playerStats.isDodging) return;

  playerStats.isPunching = true;

  enemyHealth = Math.max(0, enemyHealth - 10);

  if (enemyHealth === 0) {
    endGame("win");
  }

  setTimeout(() => {
    playerStats.isPunching = false;
  }, 250);
}

function chooseAttackPattern() {
  const index = Math.floor(Math.random() * attackPatterns.length);

  currentPattern = attackPatterns[index];
  attackIndex = 0;
}

function startDodge(direction) {
  if (gameOver || !gameStarted) return;
  if (playerStats.isDodging || playerStats.isPunching) return;

  playerStats.isDodging = true;
  playerStats.dodgeDirection = direction;

  setTimeout(() => {
    playerStats.isDodging = false;
    playerStats.dodgeDirection = null;
  }, 400);
}

gameLoop();
