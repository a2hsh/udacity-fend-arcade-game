'use strict';
// Enemies our player must avoid
var Enemy = function(x, y, height, width, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.speed = speed;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.origionalX = x;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;
  if (this.x >= 505) {
    this.x = this.origionalX;
  }
  if (this.checkCollision()) {
    if (player.level === 1) {
      player.health = player.health - randomNum(5, 10);
    } else if (player.level === 2) {
      player.health = player.health - randomNum(11, 20);
    } else if (player.level === 3) {
      player.health = player.health - randomNum(21, 30);
    }
    updateInfo();
    flashMsg('Oh snap! Collision!');
    player.reset();
    if (player.health <= 0) {
      gameReset();
      flashMsg('Game Over!');
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Collision detection
Enemy.prototype.checkCollision = function() {
  if (player.x >= this.x - this.width &&
    player.x <= this.x + this.width &&
    player.y >= this.y - this.height &&
    player.y <= this.y + this.height) {
    return true;
  } else {
    return false;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/char-boy.png';
  this.level = 1;
  this.health = 100;
  this.score = 0;
  this.origionalX = x;
  this.origionalY = y;
};

Player.prototype.update = function() {};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  if (key == 'left') {
    this.x = (this.x - this.speed) % 505;
    if (this.x < 0) {
      this.x = 0;
    }
  } else if (key == 'right') {
    this.x = (this.x + this.speed) % 505;
    if (this.x > 500) {
      this.x = 500;
    }
  } else if (key == 'up') {
    this.y = (this.y - this.speed) % 606;
    if (this.y <= 20) {
      this.reset();
      this.score++;
      if (this.score >= 5) {
        this.levelUp();
        this.score = 0;
      }
      updateInfo();
    }
  } else if (key == 'down') {
    this.y = (this.y + this.speed) % 606;
    if (this.y >= 450) {
      this.y = 450;
    }
  }
};

Player.prototype.levelUp = function() {
  if (this.level >= 3) {
    flashMsg('Hurray!  You won the game.')
    gameReset();
  } else {
    this.level++;
    this.health = 100;
    allEnemies.forEach(function(enemy) {
      enemy.speed = enemy.speed + randomNum(30, 60);
    });
    flashMsg('Level up, Woohoo!');
  }
};

Player.prototype.reset = function() {
  this.x = this.origionalX;
  this.y = this.origionalY;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var scoreSpan = document.getElementById('score-span');
var healthSpan = document.getElementById('health-span');
var levelSpan = document.getElementById('level-span');
var msgSpan = document.getElementById('msg-span');
var player = new Player(randomNum(0, 200), randomNum(350, 450), 50);
var allEnemies = [];
gameReset();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

function gameReset() {
  //this function is called in the beginning of the game, and after winning or losing
  allEnemies = [];
  player.reset();
  player.level = 1;
  player.health = 100;
  player.score = 0;
  updateInfo();
  var enemyCount = randomNum(3, 7);
  for (var i = 0; i < enemyCount; i++) {
    allEnemies.push(
      new Enemy(0, randomNum(130, 280), 40, 40, randomNum(50, 100)));
  }
}

function updateInfo() {
  levelSpan.innerText = player.level;
  healthSpan.innerText = player.health + '%';
  scoreSpan.innerText = player.score;
}

function flashMsg(message) {
  msgSpan.innerText = message;
  msgSpan.setAttribute('aria-live', 'assertive');
  setTimeout(function() {
    msgSpan.innerText = '';
  }, 3000);
}

//randomize numbers function, provided by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function randomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}