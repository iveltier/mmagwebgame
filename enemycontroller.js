import Enemy from "./enemy.js";
import MovingDirection from "./MovingDirection.js";
export default class EnemyController {
  enemyMap = [];

  enemyRows = [];

  enemyReachedBottom = false;

  defeatedEnemiesCount = 0;

  rows = 6;
  cols = 11;
  maxEnemyType = 6;

  currentDirection = MovingDirection.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1.5;
  defaultYVelocity = 2;
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;
  fireBulletTimerDefault = 80;
  fireBulletTimer = this.fireBulletTimerDefault;

  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;

    this.playerBulletController = playerBulletController;

    this.enemyDeathSound = new Audio("sounds/enemy-death.wav");
    this.enemyDeathSound.volume = 0.1;

    this.createEnemies();
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
    this.checkEnemiesAtBottom();
  }

  collisionDetection() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.enemyDeathSound.currentTime = 0;

          this.enemyDeathSound.play();
          enemyRow.splice(enemyIndex, 1);
          this.defeatedEnemiesCount++;
        }
      });
    });

    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }
  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === MovingDirection.downLeft ||
      this.currentDirection === MovingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection == MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection == MovingDirection.downLeft) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if (this.moveDown(MovingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = MovingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downRight) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
  }

  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  createEnemies() {
    this.enemyMap = this.generateRandomEnemyMap(
      this.rows,
      this.cols,
      this.maxEnemyType
    );

    const totalWidth = this.enemyMap[0].length * 50;
    const startX = (this.canvas.width - totalWidth) / 2;

    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          let imageSrc = `images/assets/standard/enemy${enemyNumber}.png`;
          this.enemyRows[rowIndex].push(
            new Enemy(startX + enemyIndex * 50, rowIndex * 35, imageSrc)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }

  reset(isInfinite) {
    this.enemyRows = [];
    this.currentDirection = MovingDirection.right;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.moveDownTimer = this.moveDownTimerDefault;
    this.fireBulletTimer = this.fireBulletTimerDefault;
    if (!isInfinite) {
      this.defeatedEnemiesCount = 0;
    }

    this.createEnemies();
  }

  checkEnemiesAtBottom() {
    this.enemyRows.flat().forEach((enemy) => {
      if (enemy.y + enemy.height >= this.canvas.height) {
        this.enemyReachedBottom = true;
      }
    });
  }

  generateRandomEnemyMap(rows, cols, maxEnemyType) {
    const enemyMap = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const enemyType = Math.floor(Math.random() * (maxEnemyType + 1));
        row.push(enemyType);
      }
      enemyMap.push(row);
    }
    return enemyMap;
  }
  switchToWeihnachtsmodus() {
    this.enemyRows.forEach((enemyRow, rowIndex) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        const randomEnemyType = Math.floor(Math.random() * 6) + 1;
        enemy.image.src = `images/assets/weihnachtsmodus/Wenemy${randomEnemyType}.png`;
      });
    });
  }
}
