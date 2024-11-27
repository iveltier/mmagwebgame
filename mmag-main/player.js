export default class Player {
  rightPressed = false;
  leftPressed = false;

  constructor(canvas, velocity) {
    this.canvas = canvas;
    this.velocity = velocity;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;

    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "images/player.png";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  draw(ctx) {
    this.move();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == `ArrowRight` || event.code == `KeyD`) {
      this.rightPressed = true;
    }
    if (event.code == `ArrowLeft` || event.code == `KeyA`) {
      this.leftPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code == `ArrowRight` || event.code == `KeyD`) {
      this.rightPressed = false;
    }
    if (event.code == `ArrowLeft` || event.code == `KeyA`) {
      this.leftPressed = false;
    }
  };
}
