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

// gestion du snake
function getSnake(canvas) {
  var canvasXmax = canvas.style.width;
  var canvasYmax = canvas.style.height;

  /**
   * Get a random number with a maximun an a minimun
   * @param   {Number} max      The max number
   * @param   {Number} min      The min number
   * @returns {Number} integer  Return a integer
   */
  function getRandomNumber(max, min = 0) {
    var num = Math.random() * (max - min);
    return parseInt(num, 10);
  }

  /**
   * Calculate the position IN the canvas
   * @param   {Number}  canvasSize  Can be height or width.
   * @param   {Number}  snakeSize   Height or width of the snake style.
   * @returns {Number}              Return a integer
   */
  function getSnakePositionRandom(canvasSize, snakeSize) {
    var max = canvasSize - snakeSize;
    return getRandomNumber(max);
  }

  function addPx(position) {
    var snake = this;
    return function () {
      snake.position[position] += snake.params.speed;
    };
  }

  function rmvPx(position) {
    var snake = this;
    return function () {
      snake.position[position] -= snake.params.speed;
    };
  }

  function SnakeFactory() {
    this.params = {
      speed: 1
    };
    this.style = {
      height: 10,
      width: 10,
      color: 'red'
    };
    this.position = {
      x: '',
      y: ''
    };
    this.tail = [];
    this.move = {
      left: '',
      top: '',
      right: '',
      down: ''
    };
  }

  var snake = new SnakeFactory();
  snake.position.x = getSnakePositionRandom(canvasXmax, snake.style.width);
  snake.position.y = getSnakePositionRandom(canvasYmax, snake.style.height);

  snake.move.left = rmvPx.call(snake, 'x');
  snake.move.top = rmvPx.call(snake, 'y');
  snake.move.right = addPx.call(snake, 'x');
  snake.move.down = addPx.call(snake, 'y');
  return snake;
}

// gestion de l affichage
function getGpu(canvas, snake) {
  function GpuFactory() {
    this.ctx = canvas.ctx;
    this.drawSnake = function () {
      this.ctx.fillStyle = snake.style.color;
      this.ctx.fillRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
  }
  return new GpuFactory();
}

// gestion keyboard
function getCommand() {
  function CommandFactory() {
    this.left = {
      keyCode: 37
    };
    this.up = {
      keyCode: 38
    };
    this.right = {
      keyCode: 39
    };
    this.right = {
      keyCode: 40
    };
  }

  return new CommandFactory();
}

function listenerKeyboard(snake, gpu) {
  window.addEventListener('keydown', function (e) {

    if (e.keyCode === 37) {
      snake.move.left();
      gpu.drawSnake();
    }

    if (e.keyCode === 38) {
      snake.move.top();
      gpu.drawSnake();
    }

    if (e.keyCode === 39) {
      snake.move.right();
      gpu.drawSnake();
    }

    if (e.keyCode === 40) {
      snake.move.down();
      gpu.drawSnake();
    }

  });

  window.addEventListener('keyup', function (e) {
    //console.log('up ' + e.keyCode);
  });
}


window.addEventListener('load', function () {
  var canvas = getCanvas('gamvas');
  // console.log(canvas);
  var snake = getSnake(canvas);
  // console.log(snake);
  var gpu = getGpu(canvas, snake);
  gpu.drawSnake();

  // console.log(gpu);
  var command = getCommand();
  // console.log(command);

  //console.log(snake.position);
  listenerKeyboard(snake, gpu);
});
