(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tileProtoJs = require('./tileProto.js');

var _tileProtoJs2 = _interopRequireDefault(_tileProtoJs);

var _snakeProtoJs = require('./snakeProto.js');

var _snakeProtoJs2 = _interopRequireDefault(_snakeProtoJs);

var _settingsJs = require('./settings.js');

var _settingsJs2 = _interopRequireDefault(_settingsJs);

var boardProto = {

  getTileAt: function getTileAt(row, col) {
    var rowObj = this.rows[row];
    return rowObj.tiles[col];
  },

  addFruit: function addFruit() {

    var isTileOccupied = true;
    do {
      var rndRow = Math.floor(Math.random() * this.numRows);
      var rndCol = Math.floor(Math.random() * this.numCols);
      var tile = this.getTileAt(rndRow, rndCol);
      isTileOccupied = !!tile.occupiedBy;
    } while (isTileOccupied);

    tile.addFruit();
  },

  createMatrix: function createMatrix(boardElement) {

    this.rows = [];
    this.fragment = document.createDocumentFragment();
    var row, col;

    for (var i = 0; i < this.numRows; i++) {
      row = document.createElement('div');
      row.classList.add('row');

      var rowObj = Object.create(null);
      rowObj.index = i;
      rowObj.tiles = [];

      for (var j = 0; j < this.numCols; j++) {
        col = document.createElement('div');
        col.classList.add('col');
        row.appendChild(col);

        var tile = Object.create(_tileProtoJs2['default']);
        tile.index = j;
        tile.row = i;
        tile.col = j;
        tile.occupiedBy = null;

        tile.element = col;
        rowObj.tiles.push(tile);
      }
      this.rows.push(rowObj);
      this.fragment.appendChild(row);
    }
    boardElement.appendChild(this.fragment);
  },

  createSnake: function createSnake() {
    var directions = _settingsJs2['default'].directions;
    var snake = Object.create(_snakeProtoJs2['default']);

    snake.direction = directions.RIGHT;
    snake.bodyParts = [];

    var head = Object.create({});
    head.isHead = true;
    head.tile = this.rows[4].tiles[5].addSnakePart(head);
    snake.bodyParts.push(head);

    var body = Object.create({});
    body.tile = this.rows[4].tiles[4].addSnakePart(body);
    snake.bodyParts.push(body);

    var body = Object.create({});
    body.tile = this.rows[4].tiles[3].addSnakePart(body);
    snake.bodyParts.push(body);

    this.snake = snake;
  },

  clear: function clear(game) {
    this.snake = null;
    game.boardElement.innerHTML = null;
    game.scoreElement.innerHTML = '0';
  },

  draw: function draw(snake) {
    var snakeHead = this.snake.getHead();
    var moveToRow, moveToCol;
    var directions = _settingsJs2['default'].directions;

    switch (this.snake.direction) {
      case directions.UP:
        moveToRow = snakeHead.tile.row - 1;
        moveToCol = snakeHead.tile.col;
        break;
      case directions.DOWN:
        moveToRow = snakeHead.tile.row + 1;
        moveToCol = snakeHead.tile.col;
        break;
      case directions.RIGHT:
        moveToRow = snakeHead.tile.row;
        moveToCol = snakeHead.tile.col + 1;
        break;
      case directions.LEFT:
        moveToRow = snakeHead.tile.row;
        moveToCol = snakeHead.tile.col - 1;
        break;
    }

    if (moveToRow < 0) {
      moveToRow = this.numRows - 1;
    } else if (moveToRow > this.numRows - 1) {
      moveToRow = 0;
    } else if (moveToCol > this.numRows - 1) {
      moveToCol = 0;
    } else if (moveToCol < 0) {
      moveToCol = this.numRows - 1;
    }

    var moveToTile = this.getTileAt(moveToRow, moveToCol);

    for (var b = 0; b < this.snake.bodyParts.length; b++) {

      var currentBodyPart = this.snake.bodyParts[b];
      var prevTile = currentBodyPart.tile;

      currentBodyPart.tile = moveToTile.addSnakePart(currentBodyPart);
      if (currentBodyPart.tile === false) {
        break;
      }
      prevTile.removeSnakePart();
      moveToTile = prevTile;
    }
  }
};

exports['default'] = boardProto;
module.exports = exports['default'];

},{"./settings.js":4,"./snakeProto.js":5,"./tileProto.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boardProtoJs = require('./boardProto.js');

var _boardProtoJs2 = _interopRequireDefault(_boardProtoJs);

var _settingsJs = require('./settings.js');

var _settingsJs2 = _interopRequireDefault(_settingsJs);

var game = Object.create({
  updateScore: function updateScore() {
    this.score += this.nextScore;
    this.scoreElement.innerHTML = this.score;
    this.speed -= 1;
    this.nextScore += 5;
  },

  resetScore: function resetScore() {
    this.score = 0;
    this.scoreElement.innerHTML = this.score;
  },

  gameOver: function gameOver() {
    window.cancelAnimationFrame(this.raf);
  },

  start: function start() {
    this.boardElement = document.getElementById('board');
    this.scoreElement = document.getElementById('score');

    if (this.board) {
      this.board.clear(this);
    }

    this.gameOver();
    this.resetScore();

    this.board = Object.create(_boardProtoJs2['default']);
    this.board.numRows = 20;
    this.board.numCols = 20;
    this.board.createMatrix(this.boardElement);

    this.board.createSnake();
    this.board.addFruit();

    this.score = 0;
    this.speed = 100;
    this.lastTick = 0;
    this.nextScore = 10;

    this.listen();

    window.requestAnimationFrame(this.run.bind(this));
  },

  listen: function listen() {
    if (this.listener) {
      document.removeEventListener('keydown', this.listener);
    }
    this.listener = this.keys.bind(this);
    document.addEventListener('keydown', this.listener);
  },

  keys: function keys(event) {

    var snake = this.board.snake,
        keycodes = _settingsJs2['default'].keycodes,
        directions = _settingsJs2['default'].directions;

    if (event.keyCode === keycodes.UP && snake.direction !== directions.DOWN) {
      snake.direction = directions.UP;
    } else if (event.keyCode === keycodes.DOWN && snake.direction !== directions.UP) {
      snake.direction = directions.DOWN;
    } else if (event.keyCode === keycodes.RIGHT && snake.direction !== directions.LEFT) {
      snake.direction = directions.RIGHT;
    } else if (event.keyCode === keycodes.LEFT && snake.direction !== directions.RIGHT) {
      snake.direction = directions.LEFT;
    }

    if (event.keyCode === keycodes.SPACE) {
      game.start();
    }
  },

  run: function run(timestamp) {
    this.raf = window.requestAnimationFrame(this.run.bind(this));

    if (timestamp - this.lastTick < this.speed) {
      return false;
    }
    this.lastTick = timestamp;

    this.board.draw();
  }
});

exports['default'] = game;
module.exports = exports['default'];

},{"./boardProto.js":1,"./settings.js":4}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameJs = require('./game.js');

var _gameJs2 = _interopRequireDefault(_gameJs);

_gameJs2['default'].start();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js').then(function (ok) {
		console.log('SW registered', ok);
	})['catch'](function (err) {
		console.log('SW error', err);
	});
}

},{"./game.js":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var directions = {
	UP: 1,
	DOWN: 2,
	LEFT: 4,
	RIGHT: 8
};

var keycodes = {
	UP: 38,
	DOWN: 40,
	RIGHT: 39,
	LEFT: 37,
	SPACE: 32
};

exports["default"] = {
	directions: directions,
	keycodes: keycodes
};
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var snakeProto = {
	getLength: function getLength() {
		return this.bodyParts.length;
	},

	getHead: function getHead() {
		return this.bodyParts[0];
	},

	getTail: function getTail() {
		return this.bodyParts[this.bodyParts.length - 1];
	}
};

exports["default"] = snakeProto;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameJs = require('./game.js');

var _gameJs2 = _interopRequireDefault(_gameJs);

var tileProto = {
  paintSnakePart: function paintSnakePart() {
    this.element.classList.add('on');
    if (this.occupiedBy.isHead) {
      this.element.classList.add('head');
    }
  },

  clearTile: function clearTile() {
    this.element.classList.remove('on', 'head');
  },

  addSnakePart: function addSnakePart(snakePart) {
    if (this.hasFruit) {
      this.removeFruit();
      _gameJs2['default'].updateScore();
      var body = Object.create({});
      var tailTile = _gameJs2['default'].board.snake.bodyParts[_gameJs2['default'].board.snake.bodyParts.length - 1].tile;
      body.tile = tailTile.addSnakePart(body);
      _gameJs2['default'].board.snake.bodyParts.push(body);
      _gameJs2['default'].board.addFruit();
    } else if (snakePart.isHead && this.occupiedBy) {
      _gameJs2['default'].gameOver();
      return false;
    }
    this.occupiedBy = snakePart;
    snakePart.tile = this;
    this.paintSnakePart();
    return this;
  },

  removeSnakePart: function removeSnakePart() {
    this.occupiedBy = null;
    this.clearTile();
    return this;
  },

  hasSnakePart: function hasSnakePart() {
    return this.occupiedBy != null;
  },

  addFruit: function addFruit() {
    this.hasFruit = true;
    this.paintFruit();
  },

  removeFruit: function removeFruit() {
    this.hasFruit = false;
    this.element.classList.remove('fruit');
  },

  paintFruit: function paintFruit() {
    this.element.classList.add('fruit');
  }
};

exports['default'] = tileProto;
module.exports = exports['default'];

},{"./game.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RlZmFuYnJ1dmlrL2dpdC9zbmFrZS9zcmMvYm9hcmRQcm90by5qcyIsIi9Vc2Vycy9zdGVmYW5icnV2aWsvZ2l0L3NuYWtlL3NyYy9nYW1lLmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL2luZGV4LmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL3NldHRpbmdzLmpzIiwiL1VzZXJzL3N0ZWZhbmJydXZpay9naXQvc25ha2Uvc3JjL3NuYWtlUHJvdG8uanMiLCIvVXNlcnMvc3RlZmFuYnJ1dmlrL2dpdC9zbmFrZS9zcmMvdGlsZVByb3RvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7MkJDQXNCLGdCQUFnQjs7Ozs0QkFDZixpQkFBaUI7Ozs7MEJBQ25CLGVBQWU7Ozs7QUFFcEMsSUFBSSxVQUFVLEdBQUc7O0FBRWYsV0FBUyxFQUFBLG1CQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDbEIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixXQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDMUI7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOztBQUVULFFBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixPQUFHO0FBQ0QsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0RCxVQUFJLElBQUksR0FBRyxJQUFJ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QUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3hDOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNyQztDQUNGLENBQUM7O3FCQUdNLFNBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHRpbGVQcm90byBmcm9tICcuL3RpbGVQcm90by5qcyc7XG5pbXBvcnQgc25ha2VQcm90byBmcm9tICcuL3NuYWtlUHJvdG8uanMnO1xuaW1wb3J0IHNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MuanMnO1xuXG52YXIgYm9hcmRQcm90byA9IHtcblxuICBnZXRUaWxlQXQocm93LCBjb2wpIHtcbiAgICB2YXIgcm93T2JqID0gdGhpcy5yb3dzW3Jvd107XG4gICAgcmV0dXJuIHJvd09iai50aWxlc1tjb2xdO1xuICB9LFxuXG4gIGFkZEZydWl0KCkge1xuXG4gICAgdmFyIGlzVGlsZU9jY3VwaWVkID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICB2YXIgcm5kUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5udW1Sb3dzKTtcbiAgICAgIHZhciBybmRDb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLm51bUNvbHMpO1xuICAgICAgdmFyIHRpbGUgPSB0aGlzLmdldFRpbGVBdChybmRSb3csIHJuZENvbCk7XG4gICAgICBpc1RpbGVPY2N1cGllZCA9ICEhdGlsZS5vY2N1cGllZEJ5O1xuICAgIH0gd2hpbGUgKGlzVGlsZU9jY3VwaWVkKTtcblxuICAgIHRpbGUuYWRkRnJ1aXQoKTtcbiAgfSxcblxuICBjcmVhdGVNYXRyaXgoYm9hcmRFbGVtZW50KSB7XG5cbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciByb3csIGNvbDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1Sb3dzOyBpKyspIHtcbiAgICAgIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycpO1xuXG4gICAgICB2YXIgcm93T2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIHJvd09iai5pbmRleCA9IGk7XG4gICAgICByb3dPYmoudGlsZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm51bUNvbHM7IGorKykge1xuICAgICAgICBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29sLmNsYXNzTGlzdC5hZGQoJ2NvbCcpO1xuICAgICAgICByb3cuYXBwZW5kQ2hpbGQoY29sKTtcblxuICAgICAgICB2YXIgdGlsZSA9IE9iamVjdC5jcmVhdGUodGlsZVByb3RvKTtcbiAgICAgICAgdGlsZS5pbmRleCA9IGo7XG4gICAgICAgIHRpbGUucm93ID0gaTtcbiAgICAgICAgdGlsZS5jb2wgPSBqO1xuICAgICAgICB0aWxlLm9jY3VwaWVkQnkgPSBudWxsO1xuXG4gICAgICAgIHRpbGUuZWxlbWVudCA9IGNvbDtcbiAgICAgICAgcm93T2JqLnRpbGVzLnB1c2godGlsZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnJvd3MucHVzaChyb3dPYmopO1xuICAgICAgdGhpcy5mcmFnbWVudC5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH1cbiAgICBib2FyZEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mcmFnbWVudCk7XG4gIH0sXG5cbiAgY3JlYXRlU25ha2UoKSB7XG4gICAgdmFyIGRpcmVjdGlvbnMgPSBzZXR0aW5ncy5kaXJlY3Rpb25zO1xuICAgIHZhciBzbmFrZSA9IE9iamVjdC5jcmVhdGUoc25ha2VQcm90byk7XG5cbiAgICBzbmFrZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb25zLlJJR0hUO1xuICAgIHNuYWtlLmJvZHlQYXJ0cyA9IFtdO1xuXG4gICAgdmFyIGhlYWQgPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICBoZWFkLmlzSGVhZCA9IHRydWU7XG4gICAgaGVhZC50aWxlID0gdGhpcy5yb3dzWzRdLnRpbGVzWzVdLmFkZFNuYWtlUGFydChoZWFkKTtcbiAgICBzbmFrZS5ib2R5UGFydHMucHVzaChoZWFkKTtcblxuICAgIHZhciBib2R5ID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgYm9keS50aWxlID0gdGhpcy5yb3dzWzRdLnRpbGVzWzRdLmFkZFNuYWtlUGFydChib2R5KTtcbiAgICBzbmFrZS5ib2R5UGFydHMucHVzaChib2R5KTtcblxuICAgIHZhciBib2R5ID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgYm9keS50aWxlID0gdGhpcy5yb3dzWzRdLnRpbGVzWzNdLmFkZFNuYWtlUGFydChib2R5KTtcbiAgICBzbmFrZS5ib2R5UGFydHMucHVzaChib2R5KTtcblxuICAgIHRoaXMuc25ha2UgPSBzbmFrZTtcbiAgfSxcblxuICBjbGVhcihnYW1lKSB7XG4gICAgdGhpcy5zbmFrZSA9IG51bGw7XG4gICAgZ2FtZS5ib2FyZEVsZW1lbnQuaW5uZXJIVE1MID0gbnVsbDtcbiAgICBnYW1lLnNjb3JlRWxlbWVudC5pbm5lckhUTUwgPSAnMCc7XG4gIH0sXG5cbiAgZHJhdyhzbmFrZSkge1xuICAgIHZhciBzbmFrZUhlYWQgPSB0aGlzLnNuYWtlLmdldEhlYWQoKTtcbiAgICB2YXIgbW92ZVRvUm93LCBtb3ZlVG9Db2w7XG4gICAgdmFyIGRpcmVjdGlvbnMgPSBzZXR0aW5ncy5kaXJlY3Rpb25zO1xuXG4gICAgc3dpdGNoICh0aGlzLnNuYWtlLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBkaXJlY3Rpb25zLlVQOlxuICAgICAgICBtb3ZlVG9Sb3cgPSBzbmFrZUhlYWQudGlsZS5yb3cgLSAxO1xuICAgICAgICBtb3ZlVG9Db2wgPSBzbmFrZUhlYWQudGlsZS5jb2w7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkaXJlY3Rpb25zLkRPV046XG4gICAgICAgIG1vdmVUb1JvdyA9IHNuYWtlSGVhZC50aWxlLnJvdyArIDE7XG4gICAgICAgIG1vdmVUb0NvbCA9IHNuYWtlSGVhZC50aWxlLmNvbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRpcmVjdGlvbnMuUklHSFQ6XG4gICAgICAgIG1vdmVUb1JvdyA9IHNuYWtlSGVhZC50aWxlLnJvdztcbiAgICAgICAgbW92ZVRvQ29sID0gc25ha2VIZWFkLnRpbGUuY29sICsgMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRpcmVjdGlvbnMuTEVGVDpcbiAgICAgICAgbW92ZVRvUm93ID0gc25ha2VIZWFkLnRpbGUucm93O1xuICAgICAgICBtb3ZlVG9Db2wgPSBzbmFrZUhlYWQudGlsZS5jb2wgLSAxO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAobW92ZVRvUm93IDwgMCkge1xuICAgICAgbW92ZVRvUm93ID0gdGhpcy5udW1Sb3dzIC0gMTtcbiAgICB9IGVsc2UgaWYgKG1vdmVUb1JvdyA+IHRoaXMubnVtUm93cyAtIDEpIHtcbiAgICAgIG1vdmVUb1JvdyA9IDA7XG4gICAgfSBlbHNlIGlmIChtb3ZlVG9Db2wgPiB0aGlzLm51bVJvd3MgLSAxKSB7XG4gICAgICBtb3ZlVG9Db2wgPSAwO1xuICAgIH0gZWxzZSBpZiAobW92ZVRvQ29sIDwgMCkge1xuICAgICAgbW92ZVRvQ29sID0gdGhpcy5udW1Sb3dzIC0gMTtcbiAgICB9XG5cbiAgICB2YXIgbW92ZVRvVGlsZSA9IHRoaXMuZ2V0VGlsZUF0KG1vdmVUb1JvdywgbW92ZVRvQ29sKTtcblxuICAgIGZvciAodmFyIGIgPSAwOyBiIDwgdGhpcy5zbmFrZS5ib2R5UGFydHMubGVuZ3RoOyBiKyspIHtcblxuICAgICAgdmFyIGN1cnJlbnRCb2R5UGFydCA9IHRoaXMuc25ha2UuYm9keVBhcnRzW2JdO1xuICAgICAgdmFyIHByZXZUaWxlID0gY3VycmVudEJvZHlQYXJ0LnRpbGU7XG5cbiAgICAgIGN1cnJlbnRCb2R5UGFydC50aWxlID0gbW92ZVRvVGlsZS5hZGRTbmFrZVBhcnQoY3VycmVudEJvZHlQYXJ0KTtcbiAgICAgIGlmIChjdXJyZW50Qm9keVBhcnQudGlsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBwcmV2VGlsZS5yZW1vdmVTbmFrZVBhcnQoKTtcbiAgICAgIG1vdmVUb1RpbGUgPSBwcmV2VGlsZTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydFxuZGVmYXVsdCBib2FyZFByb3RvO1xuIiwiaW1wb3J0IGJvYXJkUHJvdG8gZnJvbSAnLi9ib2FyZFByb3RvLmpzJztcbmltcG9ydCBzZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztcblxudmFyIGdhbWUgPSBPYmplY3QuY3JlYXRlKHtcbiAgdXBkYXRlU2NvcmUoKSB7XG4gICAgdGhpcy5zY29yZSArPSB0aGlzLm5leHRTY29yZTtcbiAgICB0aGlzLnNjb3JlRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnNjb3JlO1xuICAgIHRoaXMuc3BlZWQgLT0gMTtcbiAgICB0aGlzLm5leHRTY29yZSArPSA1O1xuICB9LFxuXG4gIHJlc2V0U2NvcmUoKSB7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5zY29yZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5zY29yZTtcbiAgfSxcblxuICBnYW1lT3ZlcigpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICB9LFxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuYm9hcmRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvYXJkJyk7XG4gICAgdGhpcy5zY29yZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmUnKTtcblxuICAgIGlmICh0aGlzLmJvYXJkKSB7XG4gICAgICB0aGlzLmJvYXJkLmNsZWFyKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICB0aGlzLnJlc2V0U2NvcmUoKTtcblxuICAgIHRoaXMuYm9hcmQgPSBPYmplY3QuY3JlYXRlKGJvYXJkUHJvdG8pO1xuICAgIHRoaXMuYm9hcmQubnVtUm93cyA9IDIwO1xuICAgIHRoaXMuYm9hcmQubnVtQ29scyA9IDIwO1xuICAgIHRoaXMuYm9hcmQuY3JlYXRlTWF0cml4KHRoaXMuYm9hcmRFbGVtZW50KTtcblxuICAgIHRoaXMuYm9hcmQuY3JlYXRlU25ha2UoKTtcbiAgICB0aGlzLmJvYXJkLmFkZEZydWl0KCk7XG5cbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLnNwZWVkID0gMTAwO1xuICAgIHRoaXMubGFzdFRpY2sgPSAwO1xuICAgIHRoaXMubmV4dFNjb3JlID0gMTA7XG5cbiAgICB0aGlzLmxpc3RlbigpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBsaXN0ZW4oKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmxpc3RlbmVyKTtcbiAgICB9XG4gICAgdGhpcy5saXN0ZW5lciA9IHRoaXMua2V5cy5iaW5kKHRoaXMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmxpc3RlbmVyKTtcbiAgfSxcblxuICBrZXlzKGV2ZW50KSB7XG5cbiAgICB2YXIgc25ha2UgPSB0aGlzLmJvYXJkLnNuYWtlLFxuICAgICAga2V5Y29kZXMgPSBzZXR0aW5ncy5rZXljb2RlcyxcbiAgICAgIGRpcmVjdGlvbnMgPSBzZXR0aW5ncy5kaXJlY3Rpb25zO1xuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IGtleWNvZGVzLlVQICYmIHNuYWtlLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9ucy5ET1dOKSB7XG4gICAgICBzbmFrZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb25zLlVQO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5Y29kZXMuRE9XTiAmJiBzbmFrZS5kaXJlY3Rpb24gIT09IGRpcmVjdGlvbnMuVVApIHtcbiAgICAgIHNuYWtlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuRE9XTjtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IGtleWNvZGVzLlJJR0hUICYmIHNuYWtlLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9ucy5MRUZUKSB7XG4gICAgICBzbmFrZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb25zLlJJR0hUO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5Y29kZXMuTEVGVCAmJiBzbmFrZS5kaXJlY3Rpb24gIT09IGRpcmVjdGlvbnMuUklHSFQpIHtcbiAgICAgIHNuYWtlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuTEVGVDtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5Y29kZXMuU1BBQ0UpIHtcbiAgICAgIGdhbWUuc3RhcnQoKTtcbiAgICB9XG4gIH0sXG5cbiAgcnVuKHRpbWVzdGFtcCkge1xuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKTtcblxuICAgIGlmICgodGltZXN0YW1wIC0gdGhpcy5sYXN0VGljaykgPCB0aGlzLnNwZWVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMubGFzdFRpY2sgPSB0aW1lc3RhbXA7XG5cbiAgICB0aGlzLmJvYXJkLmRyYXcoKTtcbiAgfVxufSk7XG5cbmV4cG9ydFxuZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lLmpzJztcblxuZ2FtZS5zdGFydCgpO1xuXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuXHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignLi4vc3cuanMnKS50aGVuKGZ1bmN0aW9uKG9rKSB7XG5cdFx0Y29uc29sZS5sb2coJ1NXIHJlZ2lzdGVyZWQnLCBvayk7XG5cdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdGNvbnNvbGUubG9nKCdTVyBlcnJvcicsIGVycik7XG5cdH0pO1xufVxuIiwidmFyIGRpcmVjdGlvbnMgPSB7XG5cdFVQOiAxLFxuXHRET1dOOiAyLFxuXHRMRUZUOiA0LFxuXHRSSUdIVDogOFxufTtcblxudmFyIGtleWNvZGVzID0ge1xuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRSSUdIVDogMzksXG5cdExFRlQ6IDM3LFxuXHRTUEFDRTogMzJcbn07XG5cbmV4cG9ydFxuZGVmYXVsdCB7XG5cdGRpcmVjdGlvbnMsXG5cdGtleWNvZGVzXG59O1xuIiwidmFyIHNuYWtlUHJvdG8gPSB7XG5cdGdldExlbmd0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib2R5UGFydHMubGVuZ3RoO1xuXHR9LFxuXG5cdGdldEhlYWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9keVBhcnRzWzBdO1xuXHR9LFxuXG5cdGdldFRhaWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9keVBhcnRzW3RoaXMuYm9keVBhcnRzLmxlbmd0aCAtIDFdO1xuXHR9LFxufTtcblxuZXhwb3J0XG5kZWZhdWx0IHNuYWtlUHJvdG87XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xuXG52YXIgdGlsZVByb3RvID0ge1xuICBwYWludFNuYWtlUGFydCgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb24nKTtcbiAgICBpZiAodGhpcy5vY2N1cGllZEJ5LmlzSGVhZCkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hlYWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgY2xlYXJUaWxlKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdvbicsICdoZWFkJyk7XG4gIH0sXG5cbiAgYWRkU25ha2VQYXJ0KHNuYWtlUGFydCkge1xuICAgIGlmICh0aGlzLmhhc0ZydWl0KSB7XG4gICAgICB0aGlzLnJlbW92ZUZydWl0KCk7XG4gICAgICBnYW1lLnVwZGF0ZVNjb3JlKCk7XG4gICAgICB2YXIgYm9keSA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgdmFyIHRhaWxUaWxlID0gZ2FtZS5ib2FyZC5zbmFrZS5ib2R5UGFydHNbZ2FtZS5ib2FyZC5zbmFrZS5ib2R5UGFydHMubGVuZ3RoIC0gMV0udGlsZTtcbiAgICAgIGJvZHkudGlsZSA9IHRhaWxUaWxlLmFkZFNuYWtlUGFydChib2R5KTtcbiAgICAgIGdhbWUuYm9hcmQuc25ha2UuYm9keVBhcnRzLnB1c2goYm9keSk7XG4gICAgICBnYW1lLmJvYXJkLmFkZEZydWl0KCk7XG4gICAgfSBlbHNlIGlmIChzbmFrZVBhcnQuaXNIZWFkICYmIHRoaXMub2NjdXBpZWRCeSkge1xuICAgICAgZ2FtZS5nYW1lT3ZlcigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLm9jY3VwaWVkQnkgPSBzbmFrZVBhcnQ7XG4gICAgc25ha2VQYXJ0LnRpbGUgPSB0aGlzO1xuICAgIHRoaXMucGFpbnRTbmFrZVBhcnQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVTbmFrZVBhcnQoKSB7XG4gICAgdGhpcy5vY2N1cGllZEJ5ID0gbnVsbDtcbiAgICB0aGlzLmNsZWFyVGlsZSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGhhc1NuYWtlUGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5vY2N1cGllZEJ5ICE9IG51bGw7XG4gIH0sXG5cbiAgYWRkRnJ1aXQoKSB7XG4gICAgdGhpcy5oYXNGcnVpdCA9IHRydWU7XG4gICAgdGhpcy5wYWludEZydWl0KCk7XG4gIH0sXG5cbiAgcmVtb3ZlRnJ1aXQoKSB7XG4gICAgdGhpcy5oYXNGcnVpdCA9IGZhbHNlO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmcnVpdCcpO1xuICB9LFxuXG4gIHBhaW50RnJ1aXQoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZydWl0Jyk7XG4gIH1cbn07XG5cbmV4cG9ydFxuZGVmYXVsdCB0aWxlUHJvdG87XG4iXX0=
