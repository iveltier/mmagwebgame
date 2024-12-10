export default class Player {
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;

    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "images/player.png";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);

    this.canvas.addEventListener("touchstart", this.touchstart);
    this.canvas.addEventListener("touchmove", this.touchmove);
    this.canvas.addEventListener("touchend", this.touchend);
  }

  draw(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWithWalls() {
    // left
    if (this.x < 0) {
      this.x = 0;
    }
    // right
    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == "ArrowRight" || event.code == "KeyD") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft" || event.code == "KeyA") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code == "ArrowRight" || event.code == "KeyD") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft" || event.code == "KeyA") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };

  touchstart = (event) => {
    const touchX =
      event.touches[0].clientX - this.canvas.getBoundingClientRect().left;

    if (touchX > this.x + this.width / 2) {
      this.rightPressed = true;
    } else if (touchX < this.x + this.width / 2) {
      this.leftPressed = true;
    }
  };

  touchmove = (event) => {
    const touchX =
      event.touches[0].clientX - this.canvas.getBoundingClientRect().left;

    if (touchX > this.x + this.width / 2) {
      this.rightPressed = true;
      this.leftPressed = false;
    } else if (touchX < this.x + this.width / 2) {
      this.leftPressed = true;
      this.rightPressed = false;
    }
  };

  touchend = () => {
    this.rightPressed = false;
    this.leftPressed = false;
  };

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
  }
}
