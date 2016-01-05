function Controller() {
  this.up = this.down = this.left = this.right = false;
  this.onKeyDown = this.onKeyDown.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);

  window.addEventListener('keydown', this.onKeyDown);
  window.addEventListener('keyup', this.onKeyUp);
}

/**
 * Handle a key down event
 *
 * @param {KeyboardEvent} event
 */
Controller.prototype.onKeyDown = function(event) {
  switch (event.key) {
  case 'w':
  case 'Up':
    this.up = true;
    break;
  case 's':
  case 'Down':
    this.down = true;
    break;
  case 'a':
  case 'Left':
    this.left = true;
    break;
  case 'd':
  case 'Right':
    this.right = true;
    break;
  }
};

/**
 * Handle a key up event
 *
 * @param {KeyboardEvent} event
 */
Controller.prototype.onKeyUp = function(event) {
  switch (event.key) {
  case 'w':
  case 'Up':
    this.up = false;
    break;
  case 's':
  case 'Down':
    this.down = false;
    break;
  case 'a':
  case 'Left':
    this.left = false;
    break;
  case 'd':
  case 'Right':
    this.right = false;
    break;
  }
};

/**
 * Return the current direction vector using the magnitude as the vector's
 * magnitude.
 *
 * @param {Number} magnitude
 * @return {Vec2}
 */
Controller.prototype.getDirection = function(magnitude) {
  if (this.up) {
    if (this.left) {
      return new Vec2(-magnitude * Math.sqrt(2) / 2,
                      -magnitude * Math.sqrt(2) / 2);
    } else if (this.right) {
      return new Vec2(magnitude * Math.sqrt(2) / 2,
                      -magnitude * Math.sqrt(2) / 2);
    } else {
      return new Vec2(0, -magnitude);
    }
  } else if (this.down) {
    if (this.left) {
      return new Vec2(-magnitude * Math.sqrt(2) / 2,
                      magnitude * Math.sqrt(2) / 2);
    } else if (this.right) {
      return new Vec2(magnitude * Math.sqrt(2) / 2,
                      magnitude * Math.sqrt(2) / 2);
    } else {
      return new Vec2(0, magnitude);
    }
  } else if (this.left) {
    return new Vec2(-magnitude, 0);
  } else if (this.right) {
    return new Vec2(magnitude, 0);
  }
  return new Vec2(0, 0);
};
