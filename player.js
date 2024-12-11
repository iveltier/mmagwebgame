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
    this.image.src = "images/assets/player.png";

    // Tastatur-Events
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);

    // Touch-Events
    this.canvas.addEventListener("touchstart", this.touchstart, {
      passive: true,
    });
    this.canvas.addEventListener("touchend", this.touchend, { passive: true });
    this.canvas.addEventListener("touchmove", this.touchmove, {
      passive: true,
    });
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
    if (this.x < 0) {
      this.x = 0;
    }
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

  // Tastatur-Events
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

  // Touch-Events
  touchstart = (event) => {
    const touchX = event.touches[0].clientX;

    if (touchX < this.canvas.width / 2) {
      this.leftPressed = true;
    } else {
      this.rightPressed = true;
    }

    // Schießen durch Berührung am oberen Bereich des Canvas
    if (event.touches[0].clientY < this.y) {
      this.shootPressed = true;
    }
  };

  touchend = () => {
    this.leftPressed = false;
    this.rightPressed = false;
    this.shootPressed = false;
  };

  touchmove = (event) => {
    const touchX = event.touches[0].clientX;

    // Spieler bewegt sich nach links oder rechts basierend auf der Position der Berührung
    if (touchX < this.canvas.width / 2) {
      this.leftPressed = true;
      this.rightPressed = false;
    } else {
      this.rightPressed = true;
      this.leftPressed = false;
    }
  };

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
  }
}
