export default class Entity {
  public id: string;
  public x: number;
  public y: number;

  public vx: number;
  public vy: number;

  constructor(x = 0, y = 0, vx = 0, vy = 0, id = '') {
    this.id = id ? id : "id" + Math.random().toString(16).slice(2);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  public accelerate(vx: number, vy: number) {
    const V = this.calculateAccelerate(vx, vy);
    this.vx = V.vx;
    this.vy = V.vy;
  }

  public calculateAccelerate(vx: number, vy: number) {
    const V = { vx: this.vx, vy: this.vy };

    if (V.vx < 0) {
      V.vx -= vx;
    } else {
      V.vx += vx;
    }

    if (V.vy < 0) {
      V.vy -= vy;
    } else {
      V.vy += vy;
    }
    return V;
  }

  public slowdown(vx: number, vy: number) {
    const V = this.calculateAccelerate(-vx, -vy);
    if (Math.abs(this.vx) < Math.abs(V.vx)) {
      this.vx = 0;
    } else {
      this.vx = V.vx;
    }
    if (Math.abs(this.vy) < Math.abs(V.vy)) {
      this.vy = 0;
    } else {
      this.vy = V.vy;
    }
  }

  public calculateMove() {
    const entity = { x: this.x, y: this.y };
    entity.x += this.vx;
    entity.y += this.vy;
    return entity;
  }

  public move() {
    const entity = this.calculateMove();
    this.x = entity.x;
    this.y = entity.y;
  }
}
