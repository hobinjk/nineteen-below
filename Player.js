function Player(stage, level, size) {
  this.level = level;
  this.loc = level.getRandomEmptyLocation();
  this.texture = PIXI.Texture.fromImage('assets/player.png');
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
  this.loc = this.level.getMovementWithCollision(this.loc, dir);

  var collidedBlock = this.level.getCollision(this.loc, dir);
  if (collidedBlock === BlockType.BLOCK) {
    this.level.block.push(this.loc);
  }

  var performCorrection = BlockType.isCollision(collidedBlock);

  var correction = 0.5;
  function correct(center, value) {
    var diff = center - value;
    if (Math.abs(diff) < correction) {
      return center;
    } else {
      return value + Utils.sign(diff) * correction;
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
