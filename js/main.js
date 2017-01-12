'use strict';

// Config de la balise canvas
function getCanvas(id) {
  function CanvasFactory() {
    this.style = {
      height: document.getElementById(id).getAttribute('height'),
      width: document.getElementById(id).getAttribute('width')
    };

    this.ctx = (function () {
      let element = document.getElementById('gamvas');
      return element.getContext('2d');
    })();
  }
  return new CanvasFactory();
}

function getSnake() {
  function SnakeFactory() {
    this.style = {
      height: 10,
      width: 10,
      color: 'red'
    };
    this.tail = [];
  }
  return new SnakeFactory();
}

function getGpu(canvas, snake) {
  function GpuFactory() {
    this.ctx = canvas.ctx;
    this.drawSnake = function (x, y) {
      this.ctx.fillStyle = snake.style.color;
      this.ctx.fillRect(x, y, snake.style.width, snake.style.height);
    };
  }
  return new GpuFactory();
}

window.addEventListener('load', function () {

  var canvas = getCanvas('gamvas');
  //console.log(canvas);
  var snake = getSnake();
  //console.log(snake);
  var gpu = getGpu(canvas, snake);
  snake.style.height = 80;
  gpu.drawSnake(50,50);
  console.log(gpu);



  return 'the end';

  // get animationFrame
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  // creation du rectangle
  ctx.fillStyle = 'red';
  var carreX = 100;
  var carreY = 100;
  ctx.fillRect(carreX, carreY, 10, 5);

  var flag = 0;

  var moveLeft = function () {
    console.log('yolo');
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = 'red';
    carreX -= 5;
    ctx.fillRect(carreX, carreY, 10, 5);

      // if (touchePressee) window.requestAnimationFrame(moveLeft);
  };





});
