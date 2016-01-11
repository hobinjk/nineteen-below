/**
 * @constructor
 * @param {PIXI.Stage} stage
 * @param {Game} game
 * @param {Level} level
 * @param {Vec2} tileLoc
 * @param {number} tileSize
 */
function Block(stage, game, level, tileLoc, tileSize) {
  this.stage = stage;
  this.game = game;

  this.loc = new Vec2(tileLoc.x * tileSize, tileLoc.y * tileSize);
  this.tileSize = tileSize;
  this.level = level;

  this.texture = PIXI.Texture.fromImage('assets/block.png');
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.position.x = this.loc.x;
  this.sprite.position.y = this.loc.y;
  this.sprite.width = this.tileSize;
  this.sprite.height = this.tileSize;
  this.stage.addChild(this.sprite);

  this.vel = new Vec2(0, 0);
  this.speed = 0.2;
  this.moving = false;
}

/**
 * Push the Block from a location
 *
 * @param {Vec2} loc
 */
Block.prototype.push = function(loc) {
  var diff = this.loc.sub(loc);
  this.vel = new Vec2(0, 0);
  if (Math.abs(diff.x) > Math.abs(diff.y)) {
    if (diff.x > 0) {
      this.vel.x = this.speed;
    } else {
      this.vel.x = -this.speed;
    }
  } else {
    if (diff.y > 0) {
      this.vel.y = this.speed;
    } else {
      this.vel.y = -this.speed;
    }
  }
  var tileLoc = this.level.getTileLoc(this.loc);
  var currentMap = this.level.map.tileMap;
  currentMap[tileLoc.x][tileLoc.y] = BlockType.EMPTY;

  this.moving = true;
};

/**
 * Update the Block's movement if necessary
 *
 * @param {number} dt
 */
Block.prototype.update = function(dt) {
  if (!this.moving) {
    return;
  }

  var vel = this.vel.mul(dt);

  var collidedBlock = this.level.getCollision(this.loc, vel);

  if (BlockType.isCollision(collidedBlock)) {
    this.moving = false;
    var tileLoc = this.level.getNearTileLoc(this.loc, vel);
    if (this.level.map.tileMap[tileLoc.x][tileLoc.y] === BlockType.GOAL) {
      this.game.win();
      return;
    }
    this.level.map.tileMap[tileLoc.x][tileLoc.y] = BlockType.BLOCK;
    this.loc.x = tileLoc.x * this.tileSize;
    this.loc.y = tileLoc.y * this.tileSize;
  } else {
    this.loc = this.loc.add(vel);
  }

  this.sprite.position.x = this.loc.x;
  this.sprite.position.y = this.loc.y;
};

/**
 * Remove the block's sprite from the stage
 */
Block.prototype.remove = function() {
  this.stage.removeChild(this.sprite);
};

var BlockType = {
  EMPTY: ' ',
  ANY: '?',
  WALL: 'x',
  BLOCK: 'B',
  GOAL: 'G',
  /**
   * Whether a block represents a collision
   *
   * @param {String} block
   * @return {boolean}
   */
  isCollision: function(block) {
    return block !== BlockType.EMPTY && block !== BlockType.GOAL;
  }
};
