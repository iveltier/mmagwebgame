import EnemyController from "./enemycontroller.js";
import Player from "./player.js";
import BulletController from "./BulletController.js";
import Enemy from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let canvasDefaultWidth = 800;
let canvasDefaultHeight = 700;
canvas.width = canvasDefaultWidth;
canvas.height = canvasDefaultHeight;
let isGameStopped = true;

const startPopup = document.getElementById("startPopup");
const changeDifficultyPopup = document.getElementById("changeDifficultyPopup");
const settings = document.getElementById("dropdown-container");
const displayCurrentGameMode = document.getElementById(
  "displayCurrentGamemode"
);

let isGamemodeactive = false;
let isGameOver = false;
let didWin = false;
let isInfinite = false;
let didInfiniteLose = false;
let backgroundMusicPlaying = false;
let backgroundMusic = null;

const background = new Image();
changeToRandomBackground();
const restartBtn = document.getElementById("restartBtn");

const IMAGE_PATHS = {
  STANDARD_PLAYER: "images/assets/standard/player.png",
  WEIHNACHTS_PLAYER: "images/assets/weihnachtsmodus/weihnachtsplayer.png",
};

const winSound = new Audio("sounds/win-sound.wav");
const loseSound = new Audio("sounds/lose-sound.wav");
const WModusEnter = new Audio("sounds/WModusEnter.mp3");

const playerBulletController = new BulletController(canvas, 8, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);
const player = new Player(canvas, 3, playerBulletController);

setInterval(game, 1000 / 60);

function start() {
  isLandscape();
  showStartPopup();
}

function game() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  if (!isGameStopped) {
    checkGameOver();
    if (!isGameOver) {
      enemyController.draw(ctx);
      player.draw(ctx);
      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
    }
  }
  if (isInfinite) {
    displayCurrentGameMode.textContent = enemyController.defeatedEnemiesCount;
  }

  if (enemyController.defeatedEnemiesCount === 50) {
    phase2();
  }
  if (enemyController.defeatedEnemiesCount === 100) {
    phase3();
  }
  if (enemyController.defeatedEnemiesCount === 150) {
    phase4();
  }
  if (enemyController.defeatedEnemiesCount === 200) {
    phase5();
  }
  if (enemyController.defeatedEnemiesCount === 250) {
    phase6();
  }
  if (enemyController.defeatedEnemiesCount === 300) {
    phase7();
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
    let yPosition = canvas.height / 2 - 100;

    ctx.fillText(text, xPosition, yPosition);

    ctx.fillStyle = "white";
    ctx.font = "25px Hyper Oxide";

    let enemiesDefeatedText = `Enemies Defeated: ${enemyController.defeatedEnemiesCount}`;
    let bulletsShotText = `Bullets shot: ${playerBulletController.bulletsShot}`;
    let hitRateText = `Hit Rate: ${Math.floor(
      (100 * enemyController.defeatedEnemiesCount) /
        playerBulletController.bulletsShot
    )}%`;

    let enemiesDefeatedTextWidth = ctx.measureText(enemiesDefeatedText).width;
    let bulletsShotTextWidth = ctx.measureText(bulletsShotText).width;
    let hitRateTextWidth = ctx.measureText(hitRateText).width;

    let enemiesDefeatedXPosition =
      (canvas.width - enemiesDefeatedTextWidth) / 2;
    let bulletsShotXPosition = (canvas.width - bulletsShotTextWidth) / 2;
    let hitRateXPosition = (canvas.width - hitRateTextWidth) / 2;

    let enemiesDefeatedYPosition = yPosition + 50;
    let bulletsShotYPosition = yPosition + 100;
    let hitRateYPosition = yPosition + 150;

    ctx.fillText(
      enemiesDefeatedText,
      enemiesDefeatedXPosition,
      enemiesDefeatedYPosition
    );
    ctx.fillText(bulletsShotText, bulletsShotXPosition, bulletsShotYPosition);

    ctx.fillText(hitRateText, hitRateXPosition, hitRateYPosition);

    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    restartBtn.style.display = "Block";
  }
}

function checkGameOver() {
  if (isGameOver) {
    displayGameOver();
    if (isInfinite) {
      didInfiniteLose = true;
    }
    return;
  }

  if (
    enemyController.collideWith(player) ||
    enemyBulletController.collideWith(player) ||
    enemyController.enemyReachedBottom
  ) {
    loseSound.play();
    isGameOver = true;
    displayGameOver();
    if (isInfinite) {
      didInfiniteLose = true;
    }
  }

  if (enemyController.enemyRows.length === 0) {
    winSound.play();
    didWin = true;
    isGameOver = true;
    if (isInfinite) {
      restartGame();
    } else {
      displayGameOver();
    }
  }
}

function restartGame() {
  isLandscape();
  didWin = false;
  isGameOver = false;
  enemyController.enemyReachedBottom = false;

  if (isGamemodeactive) {
    isGamemodeactive = false;
    changeToRandomBackground();
    playerBulletController.bulletColor = "red";
    player.image.src = IMAGE_PATHS.STANDARD_PLAYER;
  } else if (!isInfinite) {
    changeToRandomBackground();
  }

  if (!isInfinite) {
    player.reset();
    enemyController.reset(isInfinite);
    playerBulletController.reset();
    enemyBulletController.reset();
  } else {
    enemyController.reset(isInfinite);
    enemyBulletController.reset();
  }
  restartBtn.style.display = "none";

  if (didInfiniteLose) {
    enemyController.defeatedEnemiesCount = 0;
    didInfiniteLose = false;
  }
}

//Extra functions

function changeToRandomBackground() {
  if (!isGamemodeactive) {
    let randomBackgroundNum = Math.floor(Math.random() * 7 + 1);
    background.src = `images/assets/standard/background${randomBackgroundNum}.jpg`;
  }
}

function enableFullscreen() {
  if (window.innerHeight > window.innerWidth) {
    alert("Please rotate your device");
    return;
  }
  if (window.innerHeight < canvas.height) {
    alert("Fullscreen not supported");
    return;
  }

  if (isGameOver) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("sign").style.color = "white";

    enemyController.defaultXVelocity = 3;
    enemyController.defaultYVelocity = 3;
    player.velocity = 4;

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        canvas.width = canvasDefaultWidth;
        canvas.height = canvasDefaultHeight;
        document.getElementById("sign").style.color = "black";
        enemyController.defaultXVelocity = 2;
        enemyController.defaultYVelocity = 2;
        isGameOver = true;
      }
    });
  } else {
    alert(
      "The game is currently running. Please stop the game before entering fullscreen mode"
    );
  }
}

// optimisation for mobile devices (ask user to m device)

function isLandscape() {
  if (window.innerWidth < window.innerHeight) {
    alert("Please rotate your device for optimal game expierience");
  }
}

function enableWeihnachtsmodus() {
  WModusEnter.play();
  restartGame();
  isGamemodeactive = true;

  // random background
  let randomBackgroundNum = Math.floor(Math.random() * 6 + 1);
  background.src = `images/assets/weihnachtsmodus/Wbackground${randomBackgroundNum}.jpg`;

  // enemy

  enemyController.switchToWeihnachtsmodus();

  //player
  playerBulletController.bulletColor = "green";
  player.image.src = IMAGE_PATHS.WEIHNACHTS_PLAYER;
}

function showStartPopup() {
  startPopup.style.display = "block";
  settings.style.display = "none";
}

function showChangeDifficultyPopup() {
  isGameStopped = true;
  changeDifficultyPopup.style.display = "block";
}
function easy() {
  isGameStopped = false;
  isInfinite = false;

  changeDifficultyPopup.style.display = "none";
  settings.style.display = "block";
  startPopup.style.display = "none";
  displayCurrentGameMode.textContent = "Easy";

  enemyController.defaultXVelocity = 1.2;
  enemyController.defaultYVelocity = 1.5;
}
function medium() {
  isGameStopped = false;
  isInfinite = false;

  settings.style.display = "block";
  startPopup.style.display = "none";
  changeDifficultyPopup.style.display = "none";
  displayCurrentGameMode.textContent = "Medium";

  enemyController.defaultXVelocity = 1.5;
  enemyController.defaultYVelocity = 2;
}
function hard() {
  isGameStopped = false;
  isInfinite = false;

  settings.style.display = "block";
  startPopup.style.display = "none";
  changeDifficultyPopup.style.display = "none";
  displayCurrentGameMode.textContent = "Hard";

  enemyController.defaultXVelocity = 2;
  enemyController.defaultYVelocity = 3;
}
function extreme() {
  isGameStopped = false;
  isInfinite = false;

  settings.style.display = "block";
  startPopup.style.display = "none";
  changeDifficultyPopup.style.display = "none";
  displayCurrentGameMode.textContent = "Extreme";

  enemyController.defaultXVelocity = 3.2;
  enemyController.defaultYVelocity = 3.5;
  player.velocity = 4;
  playerBulletController.maxBulletsAtTime = 12;
}

function infinite() {
  isGameStopped = false;

  settings.style.display = "block";
  startPopup.style.display = "none";
  changeDifficultyPopup.style.display = "none";
  displayCurrentGameMode.textContent = "Infinite";

  isInfinite = true;
}

function playBackgroundmusic() {
  if (!backgroundMusicPlaying) {
    backgroundMusicPlaying = true;

    let randomBackgroundmusicNum = Math.floor(Math.random() * 5 + 1);
    backgroundMusic = new Audio(
      `sounds/backgroundmusic/backgroundmusic${randomBackgroundmusicNum}.mp3`
    );

    backgroundMusic.loop = true;
    backgroundMusic.play();
  } else {
    backgroundMusicPlaying = false;
    backgroundMusic.pause();
  }
}

function phase2() {
  enemyController.defaultXVelocity = 1.2;
  enemyController.defaultYVelocity = 1.5;
}

function phase3() {
  enemyController.defaultXVelocity = 1.5;
  enemyController.defaultYVelocity = 2;
}
function phase4() {
  enemyController.defaultXVelocity = 2;
  enemyController.defaultYVelocity = 3;
}
function phase5() {
  enemyController.defaultXVelocity = 3.5;
  enemyController.defaultYVelocity = 3;
  player.velocity = 4;
  playerBulletController.maxBulletsAtTime = 12;
}

function phase6() {
  enemyController.defaultXVelocity = 3.5;
  enemyController.defaultYVelocity = 3.5;
  player.velocity = 5;
  playerBulletController.maxBulletsAtTime = 15;
}

function phase7() {
  enemyController.defaultXVelocity = 4;
  enemyController.defaultYVelocity = 4;
  player.velocity = 5;
  playerBulletController.maxBulletsAtTime = 15;
}

/* SHORTCUTS */

window.addEventListener("keydown", (event) => {
  if (!isGameStopped) {
    switch (event.key) {
      //Stop Game with Esc
      case "Escape":
        if (!isGameOver) {
          loseSound.play();
          isGameOver = true;
          break;
        }
      //Restart Game with Enter
      case "Enter":
        restartGame();
        break;
      //Weihnachtsmodus with h
      case "h":
        enableWeihnachtsmodus();
        break;
      //Fullscreen with f
      case "f":
        enableFullscreen();
        break;
      //Backgroundmusic with m
      case "m":
        playBackgroundmusic();
        break;
      case "i":
        infinite();
        break;
    }
  }
});

window.restartGame = restartGame;
window.isLandscape = isLandscape;

window.enableFullscreen = enableFullscreen;

window.enableWeihnachtsmodus = enableWeihnachtsmodus;

window.start = start;

window.easy = easy;
window.medium = medium;
window.hard = hard;
window.extreme = extreme;
window.infinite = infinite;
window.showChangeDifficultyPopup = showChangeDifficultyPopup;
window.playBackgroundmusic = playBackgroundmusic;
