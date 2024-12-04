import EnemyController from "./enemycontroller.js";
import Player from "./player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
  restartGame();
});

const background = new Image();
changeToRandomBackground();

const playerBulletController = new BulletController(canvas, 8, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);
const player = new Player(canvas, 3, playerBulletController);

let isGameOver = false;
let didWin = false;

function game() {
  checkGameOver();

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
  }
}

function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "easy win" : "GameOver";

    ctx.fillStyle = "white";
    ctx.font = "70px Arial";

    let textWidth = ctx.measureText(text).width;

    let xPosition = (canvas.width - textWidth) / 2;
    let yPosition = canvas.height / 2;

    ctx.fillText(text, xPosition, yPosition);

    restartBtn.style.display = "Block";
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  }
}

function changeToRandomBackground() {
  let randomBackgroundNum = Math.floor(Math.random() * 4 + 1);
  background.src = `images/background${randomBackgroundNum}.jpg`;
}
setInterval(game, 1000 / 60);

function restartGame() {
  didWin = false;
  isGameOver = false;

  changeToRandomBackground();

  player.reset();
  enemyController.reset();

  playerBulletController.reset();
  enemyBulletController.reset();

  restartBtn.style.display = "none";
}
