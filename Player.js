function Player(stage, level, size) {
  this.level = level;
  this.loc = new Vec2(size * 4, size * 4);
  this.texture = PIXI.Texture.fromImage('assets/goal.png');
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.width = size;
  this.sprite.height = size;
  stage.addChild(this.sprite);
}

/**
 * Move the player in a direction
 *
 * @param {Vec2} dir
 */
Player.prototype.move = function(dir) {
  // Three cases: stationary, diagonal, linear.
  // Linear should attempt to conform to tile boundaries

  var performCorrection = Math.abs(dir.x) !== Math.abs(dir.y);

  var collidedBlock = this.level.getCollision(this.loc, dir);
  if (collidedBlock === BlockType.BLOCK) {
    this.level.block.push(this.loc);
  }

  this.loc = this.level.getMovementWithCollision(this.loc, dir);

  var correction = 0.5;
  function correct(center, value) {
    var diff = center - value;
    if (Math.abs(diff) < correction) {
      return center;
    } else {
      if (center > value) {
        return value + correction;
      } else if (center < value) {
        return value - correction;
      }
    }
  }

  if (performCorrection) {
    var center = this.level.getCenter(this.loc);
    // Correct the direction that we are not moving along.
    if (Math.abs(dir.x) < Math.abs(dir.y)) {
      this.loc.x = correct(center.x, this.loc.x);
    } else {
      this.loc.y = correct(center.y, this.loc.y);
    }
  }

  this.sprite.position.x = this.loc.x;
  this.sprite.position.y = this.loc.y;
};
