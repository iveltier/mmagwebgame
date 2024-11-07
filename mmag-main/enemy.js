export default class Enemy {
  constructor(x, y, imageNumber) {
    this.x = x;
    this.y = y;
    this.height = 32;
    this.width = 44;

    this.image = new Image();
    this.image.src = `images/enemy${imageNumber}.png`;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
