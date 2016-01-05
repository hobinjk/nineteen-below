/**
 * Create a new Vec2
 *
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function Vec2(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * @return {string} Stringification of Vec2
 */
Vec2.prototype.toString = function() {
  return '{' + this.x + ',' + this.y + '}';
};

/**
 * Add to another Vec2
 *
 * @param {Vec2} other
 * @return {Vec2} Result
 */
Vec2.prototype.add = function(other) {
  return new Vec2(this.x + other.x, this.y + other.y);
};

/**
 * Multiply by a constant
 *
 * @param {number} scale
 * @return {Vec2} Result
 */
Vec2.prototype.mul = function(scale) {
  if (typeof(scale) !== 'number' || isNaN(scale)) {
    throw new Error('nope');
  }
  return new Vec2(scale * this.x, scale * this.y);
};

/**
 * Add to another Vec2
 *
 * @param {Vec2} other
 * @return {Vec2} Result
 */
Vec2.prototype.sub = function(other) {
  return new Vec2(this.x - other.x, this.y - other.y);
};

/**
 * Divide by a constant
 *
 * @param {number} scale
 * @return {Vec2} Result
 */
Vec2.prototype.div = function(scale) {
  if (scale === 0) {
    throw new Error('nah');
  }
  return this.mul(1 / scale);
};

/**
 * @return {number} Magnitude of the vector squared
 */
Vec2.prototype.magSq = function() {
  return this.x * this.x + this.y * this.y;
};

/**
 * @return {number} Magnitude of the vector
 */
Vec2.prototype.mag = function() {
  return Math.sqrt(this.magSq());
};

/**
 * @param {number} newMag Desired magnitude
 * @return {Vec2} Vector with magnitude `newMag`
 */
Vec2.prototype.setMag = function(newMag) {
  if (this.magSq() === 0) {
    return this;
  }
  return this.normalize().mul(newMag);
};

/**
 * @return {Vec2} Vector with magnitude 1
 */
Vec2.prototype.normalize = function() {
  return this.div(this.mag());
};

/**
 * @param {number} maxMag Maximum allowed magnitude
 * @return {Vec2} Vector with at most magnitude `maxMag`
 */
Vec2.prototype.limit = function(maxMag) {
  if (this.magSq() < maxMag * maxMag) {
    return this;
  }
  return this.setMag(maxMag);
};

/**
 * @return {number} Heading (angle) of vector
 */
Vec2.prototype.heading = function() {
  return Math.atan2(this.y, this.x);
};

/**
 * @param {Vec2} other
 * @return {number} Dot product with other vec
 */
Vec2.prototype.dot = function(other) {
  return this.x * other.x + this.y * other.y;
};

/**
 * @param {Vec2} other
 * @return {number} Cross product with other vec
 */
Vec2.prototype.cross = function(other) {
  return this.x * other.y - this.y * other.x;
};

/**
 * @param {Vec2} other
 * @return {boolean} Int approximation of coordinates equal
 */
Vec2.prototype.intEq = function(other) {
  return Math.round(this.x) === Math.round(other.x) &&
         Math.round(this.y) === Math.round(other.y);
};

var Direction = {
  RIGHT: new Vec2(1, 0),
  LEFT: new Vec2(-1, 0),
  UP: new Vec2(0, 1),
  DOWN: new Vec2(0, -1)
};

/**
 * All directions
 */
Direction.ALL = [
  Direction.RIGHT,
  Direction.LEFT,
  Direction.UP,
  Direction.DOWN
];

/**
 * Attach directions to Vec2
 */
Vec2.Direction = Direction;

/**
 * Get the integer-valued cardinal direction between two points
 *
 * @param {Vec2} startPos
 * @param {Vec2} endPos
 * @return {Vec2?} direction
 */
Vec2.getDirectionBetween = function(startPos, endPos) {
  var dx = endPos.x - startPos.x;
  var dy = endPos.y - startPos.y;

  if (dx > 0.01) {
    return Direction.RIGHT;
  }

  if (dx < -0.01) {
    return Direction.LEFT;
  }

  if (dy > 0.01) {
    return Direction.UP;
  }

  if (dy < -0.01) {
    return Direction.DOWN;
  }

  return null;
};

/**
 * Get the cardinal direction opposite another
 *
 * @param {Vec2} direction
 * @return {Vec2} opposite direction
 */
Vec2.getOppositeDirection = function(direction) {
  if (direction === Direction.LEFT) {
    return Direction.RIGHT;
  }
  if (direction === Direction.RIGHT) {
    return Direction.LEFT;
  }
  if (direction === Direction.UP) {
    return Direction.DOWN;
  }
  if (direction === Direction.DOWN) {
    return Direction.UP;
  }
  throw new Error('Non-direction passed to getOppositeDirection');
};
