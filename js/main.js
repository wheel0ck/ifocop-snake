'use strict';

/**
 * Get a object about the canvas html
 * @param {string} id - The id of the canvas element
 * @returns {CanvasFactory} Return canvas object
 */
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

/**
 * Get a random number with a maximun an a minimun
 * @param   {Number} [max]      The max number
 * @param   {Number} [min]      The min number
 * @returns {Number} integer  Return a integer
 */
function getRandomNumber(max, min = 0) {
  var num = Math.random() * (max - min);
  return parseInt(num, 10);
}

function getApple(canvas) {
  function AppleFactory() {
    this.style = {
      height: 10,
      width: 10,
      color: 'green'
    };
    this.position = {
      x: '',
      y: ''
    };
  }
  var apple =  new AppleFactory();
  apple.position.x = getRandomNumber((canvas.style.width  - apple.style.height));
  apple.position.y = getRandomNumber((canvas.style.height - apple.style.width));

  return apple;
}

/**
 * Get a snake object
 * @param {CanvasFactory}   canvas - A canvas object
 * @returns {SnakeFactory}  Return a snake object
 */
function getSnake(canvas) {
  var canvasXmax = canvas.style.width;
  var canvasYmax = canvas.style.height;

  /**
   * Get a random position between two number
   * @param   {Number}  canvasSize  Can be height or width.
   * @param   {Number}  snakeSize   Height or width of the snake style.
   * @returns {Number}              Return a integer
   */
  function getSnakePositionRandom(canvasSize, snakeSize) {
    var max = canvasSize - snakeSize;
    return getRandomNumber(max);
  }

  /**
   * Build a function for add px to the snake
   * @param {number}      [position] - can be x or y coordonne
   * @returns {Function}  Return a function
   */
  function addPx(position) {
    var snake = this;
    return function () {
      snake.position[position] += snake.params.speed;
    };
  }

  /**
   * Build a function for remove px to the snake
   * @param {number}      [position] - can be x or y coordonne
   * @returns {Function}  Return a function
   */
  function rmvPx(position) {
    var snake = this;
    return function () {
      snake.position[position] -= snake.params.speed;
    };
  }

  /**
   * The snake factory
   * @constructor
   */
  function SnakeFactory() {
    this.params = {
      speed: 3
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

/**
 *  Gpu object is used to draw in the canvas
 * @param {CanvasFactory} [canvas] - A Canvas object
 * @param {SnakeFactory}  [snake] - A Snake object
 * @param {SnakeFactory}  [apple] - A Apple object
 * @returns {GpuFactory} Return a gpu object
 */
function getGpu(canvas, snake, apple) {
  function GpuFactory() {
    this.ctx = canvas.ctx;
    this.drawSnake = function () {
      this.ctx.fillStyle = snake.style.color;
      this.ctx.fillRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
    this.clearSnake = function () {
      this.ctx.clearRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
    this.drawApple = function () {
      this.ctx.fillStyle = apple.style.color;
      this.ctx.fillRect(apple.position.x, apple.position.y, apple.style.width, apple.style.height);
    };
    this.clearApple = function () {
      this.ctx.clearRect(apple.position.x, apple.position.y, apple.style.width, apple.style.height);
    };
  }
  return new GpuFactory();
}

/**
 * Object used to manage keyboar and animation
 * @param {AnimationManagerFactory}   [animationManager] - AnimationManager object
 * @returns {KeyboardManagerFactory}  Returne a KeyboardManager object
 */
function getKeyboardManager(animationManager) {
  function KeyboardManagerFactory() {
    this.firstKeydown = true;
    this.lastKeyCode = '';
    this.mapping = {37: 'left', 38: 'top', 39: 'right', 40: 'down'};
    this.setKeydown = function (keyCode) {
      if (this.mapping[keyCode]) {
        if (this.firstKeydown === true) {
          animationManager.run(this.mapping[keyCode]);
          // escape the keyboard recursion
          this.firstKeydown = false;
          this.lastKeyCode = keyCode;
        }
        // manage two keydown in the same time
        if (this.firstKeydown === false && this.lastKeyCode !== keyCode) {
          animationManager.stop();
          animationManager.run(this.mapping[keyCode]);
        }
      }
    };
    this.setKeyup = function (keycode) {
      if (this.mapping[keycode]) {
        animationManager.stop();
        this.firstKeydown = true;
      }
    };
  }

  return new KeyboardManagerFactory();
}

/**
 * Use to manage animation in terms of keyboard
 * @param {GpuFactory}                [gpu] - a gpu object
 * @param {SnakeFactory}              [snake] - a snake object
 * @returns {AnimationManagerFactory} Return a AnimationManager
 */
function getAnimationManager(gpu, snake) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function builderSnakeMove(direction, animationManager) {
    return function snakeMove() {
      gpu.clearSnake();
      snake.move[direction]();
      gpu.drawSnake();
      animationManager.lastAnimationFrame = window.requestAnimationFrame(snakeMove);
    };
  }

  function AnimationManagerFactory() {
    this.lastAnimationFrame = 0;
    this.run = function (direction) {
      // -> gestion des collision avant refresh

      //collisionEngine
      this.lastAnimationFrame = window.requestAnimationFrame(builderSnakeMove(direction, this));
    };
    this.stop = function () {
      cancelAnimationFrame(this.lastAnimationFrame);
    };
  }
  return new AnimationManagerFactory();
}

/**
 * Listening the keyboard, and lunch action
 * @param {KeyboardManagerFactory} [keyboardManager] - a KeyboardManager
 * @return {void}
 */
function listenerKeyboard(keyboardManager) {
  window.addEventListener('keydown', function (e) {
    keyboardManager.setKeydown(e.keyCode);
  });

  window.addEventListener('keyup', function (e) {
    keyboardManager.setKeyup(e.keyCode);
  });
}

/**
 * The beginning ...
 */
window.addEventListener('load', function () {
  var canvas = getCanvas('gamvas');
  // console.log(canvas);
  var snake = getSnake(canvas);
  var apple = getApple(canvas);
  // console.log(snake);
  var gpu = getGpu(canvas, snake, apple);
  gpu.drawSnake();
  gpu.drawApple();

  var animationManager = getAnimationManager(gpu, snake);
  // console.log(gpu);
  var keyboardManager = getKeyboardManager(animationManager);
  // console.log(command);

  listenerKeyboard(keyboardManager);
});
