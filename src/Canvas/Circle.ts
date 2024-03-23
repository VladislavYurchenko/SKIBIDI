import Entity from "./Entity";

export default class Circle extends Entity {
  public R: number;

  public color: string;
  public colorOriginal: string;

  constructor(x = 0, y = 0, R = 15, color = "#000000", vx = 0, vy = 0) {
    super(x, y, vx, vy);
    this.R = R;
    this.color = color;
    this.colorOriginal = color;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.R, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  public collision(entity: Entity) {
    var a = entity.calculateMove().x - this.x;
    var b = entity.calculateMove().y - this.y;
    var c = a * a + b * b;
    var radii = this.R;
    return radii * radii >= c;
  }
}
