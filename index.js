import EnemyController from "./enemycontroller.js";
import Player from "./player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const body = document.body;

let canvasDefaultWidth = 800;
let canvasDefaultHeight = 600;

canvas.width = canvasDefaultWidth;
canvas.height = canvasDefaultHeight;

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
  restartGame();
});

const winSound = new Audio("sounds/win-sound.wav");
const loseSound = new Audio("sounds/lose-sound.wav");

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
    let text = didWin ? "easy win" : "Game Over";

    ctx.fillStyle = "white";
    ctx.font = "70px Hyper Oxide";
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    let textWidth = ctx.measureText(text).width;

    let xPosition = (canvas.width - textWidth) / 2;
    let yPosition = canvas.height / 2;

    ctx.fillText(text, xPosition, yPosition);

    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    restartBtn.style.display = "Block";
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyController.collideWith(player)) {
    loseSound.play();
    isGameOver = true;
  }

  if (enemyBulletController.collideWith(player)) {
    loseSound.play();
    isGameOver = true;
  }

  if (enemyController.enemyRows.length === 0) {
    winSound.play();
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
function enableFullscreen() {
  if (didWin == true || isGameOver == true) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("sign").style.color = "white";
    enemyController.defaultXVelocity = 4;
    enemyController.defaultYVelocity = 4;

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        canvas.width = canvasDefaultWidth;
        canvas.height = canvasDefaultHeight;
        document.getElementById("sign").style.color = "black";
        enemyController.defaultXVelocity = 2;
        enemyController.defaultYVelocity = 2;
      }
    });
  }
}

window.enableFullscreen = enableFullscreen;
