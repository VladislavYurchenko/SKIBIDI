import Entity from "./Entity";

export default class Mouse extends Entity {
  
  // collision(entity: Entity) {
  //   var a = entity.calculateMove().x - this.x;
  //   var b = entity.calculateMove().y - this.y;
  //   var c = a * a + b * b;
  //   var radii = entity.R;
  //   return radii * radii >= c;
  // }
  getPos(canvas: HTMLCanvasElement, e: MouseEvent): Mouse {
    var rect = canvas.getBoundingClientRect();
    return new Mouse(e.clientX - rect.left, e.clientY - rect.top);
  }
  public calculateMove() {
    const entity = { x: this.x, y: this.y };
    return entity;
  }
}
 