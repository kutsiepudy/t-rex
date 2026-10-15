const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let enemyHealth = 100;
let playerStats = {
  health: 100,
  stamina: 100,
  energy: 0,
  isPunching: false,
  isDodging: false
};

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  // will add when confirmed controls work
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0,  canvas.width, canvas.height);
  
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(350, 150, 100, 200);
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

function triggerPlayerPunch(side) {
  playerStats.isPunching = true;
  
  setTimeout(() => {
    playerStats.isPunching = false;
  }, 250);
}

gameLoop();
