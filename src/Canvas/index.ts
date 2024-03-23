import Circle from "./Circle";
import Entity from "./Entity";
import Mouse from "./Mouse";

const canvasInit = () => {
  const canvas = document.getElementById("the-canvas") as HTMLCanvasElement;
  const colorPiker = document.getElementById("color-picker") as HTMLDivElement;
  const colorPikerInput = colorPiker.querySelector("input");

  if (!canvas || !colorPiker || !colorPikerInput || canvas === null) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const generate = (ballsCount = 10) => {
    const balls: Circle[] = [];
    let rows = 1;
    for (let index = 0; index < ballsCount; index++) {
      let x = 40 * index + 50;
      let y = 100 * rows;

      const ball = new Circle(x, y, 15, "black", 0, 0);
      balls.push(ball);
    }
    return balls;
  };

  let traked: Circle | null = null;
  let mouse: Mouse | null = null;
  let marked: Circle | null = null;
  const entities = generate(10);

  colorPikerInput.addEventListener("input", () => {
    console.log(colorPikerInput.value);
    if (marked) {
      marked.color = colorPikerInput.value;
      marked.colorOriginal = colorPikerInput.value;
    }
  });

  const handleMouseDown = (event: MouseEvent, entities: Circle[]) => {
    if (event.button === 0) {
      mouse = new Mouse().getPos(canvas, event);

      entities.forEach((entity) => {
        if (mouse && entity.collision(mouse)) {
          traked = entity;
        } else {
        }
      });
    }
  };
  const handleMouseMove = (event: MouseEvent, entities: Circle[]) => {
    mouse = new Mouse().getPos(canvas, event);
  };
  const handleMouseUp = (event: MouseEvent, entities: Circle[]) => {
    if (event.button === 2) {
      mouse = new Mouse().getPos(canvas, event);
      let col = false;
      entities.forEach((entity) => {
        if (mouse && entity.collision(mouse)) {
          marked = entity;
          col = true;
        }
      });

      if (col) {
        colorPiker.classList.add("active");
      } else {
        colorPiker.classList.remove("active");
        marked = null;
      }
    }
    if (event.button === 0) {
      colorPiker.classList.remove("active");
      marked = null;
    }
    traked = null;
  };

  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    handleMouseDown(event, entities);
  });
  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    handleMouseMove(event, entities);
  });
  canvas.addEventListener("mouseup", (event: MouseEvent) => {
    handleMouseUp(event, entities);
  });

  canvas.oncontextmenu = (e) => e.preventDefault();

  const collision = (entity1: Circle, entity2: Circle) => {
    var a = entity1.calculateMove().x - entity2.calculateMove().x;
    var b = entity1.calculateMove().y - entity2.calculateMove().y;
    var c = a * a + b * b;
    var radii = entity1.R + entity2.R;
    return radii * radii >= c;
  };

  entities.forEach((ball, index) => {
    ball.accelerate(0, 0);
  });

  function update(ctx: CanvasRenderingContext2D, entities: Circle[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let move = true;
    let coll = false;

    const skipCalc: string[] = [];

    entities.forEach((ball) => {
      entities.forEach((entity) => {
        if (entity === ball) return;

        if (skipCalc.includes(ball.id)) return;

        if (collision(ball, entity)) {
          if (ball.vx > 0 && entity.vx > 0) {
            if (ball.x > entity.x) {
              entity.slowdown(ball.vx / 2, 0);
              ball.accelerate(ball.vx / 2, 0);
            } else {
              ball.slowdown(ball.vx / 2, 0);
              entity.accelerate(ball.vx / 2, 0);
            }
          } else if (ball.vx > 0 && entity.vx < 0) {
            if (Math.abs(ball.vx) > Math.abs(entity.vx)) {
              ball.slowdown(Math.abs(entity.vx), 0);
              entity.vx = 0;
              entity.accelerate(ball.vx, 0);
            } else if (Math.abs(ball.vx) < Math.abs(entity.vx)) {
              entity.slowdown(Math.abs(ball.vx), 0);
              ball.vx = 0;
              ball.accelerate(entity.vx, 0);
            } else if (Math.abs(ball.vx) === Math.abs(entity.vx)) {
              ball.vx = -ball.vx / 2;
              entity.vx = -entity.vx / 2;
            }
          } else if (ball.vx < 0 && entity.vx < 0) {
            if (ball.x > entity.x) {
              ball.slowdown(Math.abs(ball.vx / 2), 0);
              entity.accelerate(Math.abs(ball.vx / 2), 0);
            } else {
              ball.accelerate(Math.abs(entity.vx / 2), 0);
              entity.slowdown(Math.abs(entity.vx / 2), 0);
            }
          } else if (ball.vx === 0 && entity.vx > 0) {
            ball.accelerate((entity.vx / 2) * 1.5, 0);
            entity.slowdown((entity.vx / 2) * 1.5, 0);
          } else if (ball.vx === 0 && entity.vx < 0) {
            ball.accelerate((entity.vx / 2) * 1.5, 0);
            entity.slowdown((entity.vx / 2) * 1.5, 0);
          }

          if (ball.vy > 0 && entity.vy > 0) {
            if (ball.y > entity.y) {
              entity.slowdown(0, ball.vy / 2);
              ball.accelerate(0, ball.vy / 2);
            } else {
              ball.slowdown(0, ball.vy / 2);
              entity.accelerate(0, ball.vy / 2);
            }
          } else if (ball.vy > 0 && entity.vy < 0) {
            if (Math.abs(ball.vy) > Math.abs(entity.vy)) {
              ball.slowdown(0, Math.abs(entity.vy));
              entity.vy = 0;
              entity.accelerate(0, ball.vy);
            } else if (Math.abs(ball.vy) < Math.abs(entity.vy)) {
              entity.slowdown(0, Math.abs(ball.vy));
              ball.vy = 0;
              ball.accelerate(0, entity.vy);
            } else if (Math.abs(ball.vy) === Math.abs(entity.vy)) {
              ball.vy = -ball.vy / 2;
              entity.vy = -entity.vy / 2;
            }
          } else if (ball.vy < 0 && entity.vy > 0) {
            if (Math.abs(ball.vy) > Math.abs(entity.vy)) {
              ball.slowdown(0, Math.abs(entity.vy));
              entity.vy = 0;
              entity.accelerate(0, ball.vy);
            } else if (Math.abs(ball.vy) < Math.abs(entity.vy)) {
              entity.slowdown(0, Math.abs(ball.vy));
              ball.vy = 0;
              ball.accelerate(0, entity.vy);
            } else if (Math.abs(ball.vy) === Math.abs(entity.vy)) {
              ball.vy = -ball.vy / 2;
              entity.vy = -entity.vy / 2;
            }
          } else if (ball.vy === 0 && entity.vy > 0) {
            ball.accelerate(0, (entity.vy / 2) * 1.5);
            entity.slowdown(0, (entity.vy / 2) * 1.5);
          } else if (ball.vy === 0 && entity.vy < 0) {
            ball.accelerate(0, (entity.vy / 2) * 1.5);
            entity.slowdown(0, (entity.vy / 2) * 1.5);
          }

          skipCalc.push(entity.id);
        }
      });

      if (ball.y + ball.vy > canvas.height - ball.R || ball.y + ball.vy < ball.R) {
        ball.slowdown(0, Math.abs((ball.vy / 100) * 20));
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width - ball.R || ball.x + ball.vx < ball.R) {
        ball.slowdown(Math.abs((ball.vx / 100) * 20), 0);
        ball.vx = -ball.vx;
      }
      if (mouse && ball.collision(mouse as Entity)) {
        coll = true;
      }
      ball.move();
      ball.draw(ctx);
    });

    if (coll) {
      canvas.style.cursor = "grab";
    } else {
      canvas.style.cursor = "default";
    }
    if (traked && mouse) {
      const vector = { x: 0, y: 0 };

      vector.x = (traked.x - mouse.x) * -1;
      vector.y = (traked.y - mouse.y) * -1;

      traked.vx = vector.x / 1;
      traked.vy = vector.y / 1;
    }

    if (move) window.requestAnimationFrame(() => update(ctx, entities));
  }
  window.requestAnimationFrame(() => update(ctx, entities));
};
export default canvasInit;
