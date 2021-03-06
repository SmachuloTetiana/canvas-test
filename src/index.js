import { World, System, Component, TagComponent, Types } from "ecsy";

const NUM_ELEMENTS = 40;
const SPEED_MULTIPLIER = 0.5;
const SHAPE_SIZE = 10;
const SHAPE_HALF_SIZE = SHAPE_SIZE / 2;

// Initialize canvas
let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");
let x, y;
//----------------------
// Components
//----------------------

// Velocity component
class Velocity extends Component {}

Velocity.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number },
};

// Position component
class Position extends Component {}

Position.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number },
};

// Shape component
class Shape extends Component {}

Shape.schema = {
  primitive: { type: Types.String, default: "box" },
};

// Renderable component
class Renderable extends TagComponent {}

//----------------------
// Systems
//----------------------

// MovableSystem
class MovableSystem extends System {
  // This method will get called on every frame by default
  execute(delta, time) {
    // Iterate through all the entities on the query
    this.queries.moving.results.forEach((entity) => {
      var velocity = entity.getComponent(Velocity);
      var position = entity.getMutableComponent(Position);
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
    });
  }
}

// Define a query of entities that have "Velocity" and "Position" components
MovableSystem.queries = {
  moving: {
    components: [Velocity, Position],
  },
};

// RendererSystem
class RendererSystem extends System {
  // This method will get called on every frame by default
  execute(delta, time) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Iterate through all the entities on the query
    this.queries.renderables.results.forEach((entity) => {
      var shape = entity.getComponent(Shape);
      var position = entity.getComponent(Position);
      if (shape.primitive === "box") {
        this.drawBox(position);
      } else {
        this.drawCircle(position);
      }
    });
  }

  drawCircle(position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, SHAPE_HALF_SIZE, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ccc";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#888";
    ctx.stroke();
  }

  drawBox(position) {
    ctx.beginPath();
    ctx.rect(
      position.x - SHAPE_HALF_SIZE,
      position.y - SHAPE_HALF_SIZE,
      SHAPE_SIZE,
      SHAPE_SIZE
    );
    ctx.fillStyle = "#e2736e";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#b74843";
    ctx.stroke();
  }
}

// Define a query of entities that have "Renderable" and "Shape" components
RendererSystem.queries = {
  renderables: {
    components: [Renderable, Shape],
  },
};

// Create world and register the components and systems on it
var world = new World();

world
  .registerComponent(Velocity)
  .registerComponent(Position)
  .registerComponent(Shape)
  .registerComponent(Renderable)
  .registerSystem(MovableSystem)
  .registerSystem(RendererSystem);

function create() {
  for (let i = 0; i < NUM_ELEMENTS; i++) {
    let time = (Math.floor(Math.random() * 5) + 1) * 1000;

    let entity = world
      .createEntity()
      .addComponent(Velocity, getRandomVelocity())
      .addComponent(Shape, getRandomShape())
      .addComponent(Position, getRandomPosition())
      .addComponent(Renderable);

    setTimeout(() => {
      entity.remove();
    }, time);
  }
}

// Some helper functions when creating the components
function getRandomVelocity() {
  return {
    x: SPEED_MULTIPLIER * (2 * Math.random() - 1),
    y: SPEED_MULTIPLIER * (2 * Math.random() - 1),
  };
}

function getRandomPosition() {
  return {
    x: x || Math.random() * canvasWidth,
    y: y || Math.random() * canvasHeight,
  };
}

function getRandomShape() {
  return {
    primitive: Math.random() >= 0.5 ? "circle" : "box",
  };
}

// Run!
function run() {
  // Compute delta and elapsed time
  var time = performance.now();
  var delta = time - lastTime;

  // Run all the systems
  world.execute(delta, time);

  lastTime = time;
  requestAnimationFrame(run);
}
var lastTime = performance.now();

const onMouseDown = (event) => {
  x = event.pageX - canvas.offsetLeft;
  y = event.pageY - canvas.offsetTop;
  run();
  create();
};

document.addEventListener("mousedown", onMouseDown);
