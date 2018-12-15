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
  case 'ArrowUp':
  case 'Up': // IE/Edge specific value
    this.up = true;
    break;
  case 's':
  case 'ArrowDown':
  case 'Down': // IE/Edge specific value
    this.down = true;
    break;
  case 'a':
  case 'ArrowLeft':
  case 'Left': // IE/Edge specific value
    this.left = true;
    break;
  case 'd':
  case 'ArrowRight':
  case 'Right': // IE/Edge specific value
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
  case 'ArrowUp':
  case 'Up': // IE/Edge specific value
    this.up = false;
    break;
  case 's':
  case 'ArrowDown':
  case 'Down': // IE/Edge specific value:
    this.down = false;
    break;
  case 'a':
  case 'ArrowLeft':
  case 'Left': // IE/Edge specific value
    this.left = false;
    break;
  case 'd':
  case 'ArrowRight':
  case 'Right': // IE/Edge specific value
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
