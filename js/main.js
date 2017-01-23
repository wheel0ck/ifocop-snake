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
    this.position = {
      x: 0,
      y: 0
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
    this.newPosition = function () {
      this.position.x = getRandomNumber((canvas.style.width  - this.style.height));
      this.position.y = getRandomNumber((canvas.style.height - this.style.width));
    };
    this.reload =  function () {
      this.newPosition();
    };
  }
  var apple =  new AppleFactory();
  apple.position.x = getRandomNumber((canvas.style.width  - apple.style.height));
  apple.position.y = getRandomNumber((canvas.style.height - apple.style.width));
  // @todo: newPosition()
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
    this.positionHistory = [];
    this.eat = 0;
    this.move = {
      left: '',
      top: '',
      right: '',
      down: ''
    };
    this.randomPosition = function () {
      this.position.x = getSnakePositionRandom(canvasXmax, snake.style.width);
      this.position.y = getSnakePositionRandom(canvasYmax, snake.style.height);
    };
    // @todo: (this.position) marche pas ?!
    this.recordPosition = function (x, y) {
      this.positionHistory.unshift({x: x, y: y});
    };
    this.getTail = function () {
      var tail = [];
      var step = 4;
      var j = step;
      for (var i = 0; i < this.eat; i++) {
        tail.push(this.positionHistory[j]);
        j += step;
      }
      // clean history
      this.positionHistory.splice(j);
      return tail;
    };
    this.setEat = function () {
      this.eat += 1;
    };
    this.reload = function () {
      this.positionHistory = [];
      this.eat = 0;
      this.randomPosition();
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
    this.drawSnakeTail = function () {
      var snakeTail = snake.getTail();
      for (var i = 0; i < snakeTail.length; i++) {
        var position = snakeTail[i];
        this.ctx.fillStyle = snake.style.color;
        this.ctx.fillRect(position.x, position.y, snake.style.width, snake.style.height);
      }
    };
    this.clearSnakeTail = function () {
      var snakeTail = snake.getTail();
      for (var i = 0; i < snakeTail.length; i++) {
        var position = snakeTail[i];
        this.ctx.clearRect(position.x, position.y, snake.style.width, snake.style.height);
      }
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
        if (this.lastKeyCode === '' && this.firstKeydown) {
          animationManager.run(this.mapping[keyCode]);
          this.lastKeyCode = keyCode;
          this.firstKeydown = false;
        } else {
          animationManager.stop();
          animationManager.run(this.mapping[keyCode]);
          this.lastKeyCode = keyCode;
        }
      }
    };
    this.reload = function () {
      animationManager.stop();
      this.lastKeyCode = '';
      this.firstKeydown = true;
    };
  }
  return new KeyboardManagerFactory();
}

function getCollisionEngin() {
  function CollisionFactory() {
    this.hasCollision = function (rect1, rect2) {
      if (rect1.position.x < rect2.position.x + rect2.style.width && rect1.position.x + rect1.style.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.style.height && rect1.style.height + rect1.position.y > rect2.position.y) {
        return true;
      }
      return false;
    };

    this.inCanvas = function (snake, canvas) {
      if (snake.position.x > canvas.position.x && snake.position.x + snake.style.width < canvas.style.width
      && snake.position.y > canvas.position.y && snake.position.y + snake.style.height < canvas.style.height) {

        return true;
      }
      return false;
    };
  }

  return new CollisionFactory();
}

/**
 * Use to manage animation in terms of keyboard
 * @param {GpuFactory}                [gpu] - a gpu object
 * @param {SnakeFactory}              [snake] - a snake object
 * @param {CollisionFactory}          [collision] - a object to compute the collision
 * @returns {AnimationManagerFactory} Return a AnimationManager
 */
function getAnimationManager(gpu, snake, collision, canvas, apple, score, timer) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function AnimationManagerFactory() {
    this.lastAnimationFrame = 0;
    this.bag = [];
    this.catling = function () {
      var animationManager = this;
      return function catling() {
        animationManager.bag.forEach(function (element) {
          element();
        });
        animationManager.lastAnimationFrame = window.requestAnimationFrame(catling);
      };
    };
    this.run = function (direction) {
      var snakeMove = this.builderSnakeMove(direction);
      this.bag.push(snakeMove);
      this.lastAnimationFrame = window.requestAnimationFrame(this.catling());
    };
    this.stop = function () {
      cancelAnimationFrame(this.lastAnimationFrame);
      this.bag = [];
    };
    this.builderSnakeMove = function (direction) {
      return function () {
        gpu.clearSnake();
        gpu.clearSnakeTail();

        if (score.isPlaying && timer.isPlaying) {
          snake.move[direction]();
          snake.recordPosition(snake.position.x, snake.position.y);
        }

        if (collision.hasCollision(snake, apple)) {
          snake.setEat();
          score.addScore();
          score.printScore();
          gpu.clearApple();
          apple.newPosition();
          gpu.drawApple();
        }

        //snake se mort la queue
        if (snake.eat > 1) {

          var transformerTail = {
            style: {
              width: snake.style.width,
              height: snake.style.height
            }
          };

          var tail = snake.getTail();

          for (var i = 1; i < tail.length; i++) {
            transformerTail.position = tail[i];
            if (collision.hasCollision(snake, transformerTail)) {
              console.log('touch');
              score.isPlaying = false;
              timer.stop();
            };
          }
        }

        if (!collision.inCanvas(snake, canvas)) {
          console.log('out');

          timer.stop();
          score.isPlaying = false;
          gpu.drawSnake();
          gpu.drawSnakeTail();
        } else {
          gpu.drawSnake();
          gpu.drawSnakeTail();
        }
      };
    };
  }
  return new AnimationManagerFactory();
}
/**
 * Give a game object
 * @param {string} [id]   Add the id of the html tag
 * @returns {ScoreFactory} Return a object game
 */
function getScore(id) {
  function ScoreFactory() {
    this.score = 0;
    this.step = 1;
    this.isPlaying = true;
    this.addScore = function () {
      if (this.isPlaying) {
        this.score = this.score + this.step;
      }
    };
    this.dom = (function () {
      return document.getElementById(id);
    })();
    this.printScore = function () {
      this.dom.innerHTML = 'Score = ' + this.score;
    };
    this.reload = function () {
      this.score = 0;
      this.isPlaying = true;
      this.printScore();
    };
  }
  return new ScoreFactory();
}
/**
 * Give a timer object
 * @param {string}          id Add the id of the html tag
 * @returns {TimerFactory}  Return a Timer object
 */
function getTimer(id) {
  function TimerFactory() {
    this.params = { defaultSecond: 60};
    this.second = this.params.defaultSecond;
    this.isPlaying = true;
    this.dom = (function () {
      return document.getElementById(id);
    })();
    this.printTime = function () {
      this.dom.innerHTML = 'Timer = ' + this.second;
    };
    this.idSetInterval = Number();
    this.run = function () {
      this.idSetInterval = setInterval(function (timer) {
        timer.second -= 1;
        if (timer.second >= 1 ) {
          timer.printTime();
        } else {
          timer.printTime();
          timer.stop();
          timer.isPlaying = false;
        }
      }, 1000, this);
    };
    this.stop = function () {
      clearInterval(this.idSetInterval);
    };
    this.reload = function () {
      this.isPlaying = true;
      this.second = this.params.defaultSecond;
      this.printTime();
      this.run();
    };
  }
  return new TimerFactory();
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
}

/**
 * The beginning ...
 */
window.addEventListener('load', function () {
  var score = getScore('score');
  score.printScore();
  var timer = getTimer('timer');
  timer.printTime();
  timer.run();

  var canvas = getCanvas('gamvas');
  // console.log(canvas);
  var snake = getSnake(canvas);
  var apple = getApple(canvas);
  // console.log(snake);
  var gpu = getGpu(canvas, snake, apple);
  gpu.drawSnake();
  gpu.drawApple();

  var collision = getCollisionEngin();
  // console.log(collision);

  var animationManager = getAnimationManager(gpu, snake, collision, canvas, apple, score, timer);
  // console.log(gpu);
  var keyboardManager = getKeyboardManager(animationManager);
  // console.log(command);

  listenerKeyboard(keyboardManager);

  var button = document.getElementById('reload');
  button.addEventListener('click', function () {
    console.log('reload');
    gpu.clearSnake();
    gpu.clearSnakeTail();
    gpu.clearApple();

    snake.reload();
    apple.reload();
    score.reload();
    timer.reload();

    gpu.drawSnake();
    gpu.drawApple();

    keyboardManager.reload();
  });
});
