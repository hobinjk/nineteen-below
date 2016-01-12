function Level(stage, game, width, height, tileSize) {
  this.stage = stage;
  this.game = game;
  this.width = width;
  this.height = height;
  this.tileSize = tileSize;

  this.tileWidth = this.width / this.tileSize;
  this.tileHeight = this.height / this.tileSize;

  this.map = new LevelMap(this.tileWidth, this.tileHeight);

  this.container = new PIXI.Container();
  this.stage.addChild(this.container);

  this.loadTextures();
  this.regenerate();
}

/**
 * Regenerate the level, generating the map, creating the tiles for the map,
 * and creating the ice block
 */
Level.prototype.regenerate = function() {
  this.generateMap();
  this.createTiles();
  this.createBlock();
};

/**
 * Get tile location corresponding to pixel location
 *
 * @param {Vec2} loc
 * @return {Vec2}
 */
Level.prototype.getTileLoc = function(loc) {
  return new Vec2(
    Math.floor(loc.x / this.tileSize),
    Math.floor(loc.y / this.tileSize));
};

/**
 * Get tile location corresponding to pixel location with bias based on dir
 *
 * @param {Vec2} loc
 * @param {Vec2} dir
 * @return {Vec2}
 */
Level.prototype.getNearTileLoc = function(loc, dir) {
  var x = loc.x / this.tileSize;
  var y = loc.y / this.tileSize;

  if (dir.x < 0) {
    x = Math.floor(x);
  } else {
    x = Math.ceil(x);
  }
  if (dir.y < 0) {
    y = Math.floor(y);
  } else {
    y = Math.ceil(y);
  }
  return new Vec2(x, y);
};

/**
 * Get the closest tile center to the given coordinates
 *
 * @param {Vec2} loc
 * @return {Object}
 */
Level.prototype.getCenter = function(loc) {
  return new Vec2(
    Math.round(loc.x / this.tileSize) * this.tileSize,
    Math.round(loc.y / this.tileSize) * this.tileSize);
};

/**
 * Detect the block (or lack thereof) collided with moving from loc in dir.
 *
 * @param {Vec2} loc
 * @param {Vec2} dir
 * @return {String} Block type collided with
 */
Level.prototype.getCollision = function(loc, dir) {
  if (dir.x === 0 && dir.y === 0) {
    return BlockType.EMPTY;
  }

  var newLoc = loc.add(dir);
  var tileLoc = this.getTileLoc(newLoc);

  // If going to the right look to the right by bumping the considered tile to
  // the right
  var bumpX = 0;
  if (dir.x > 0) {
    bumpX = 1;
  }

  var bumpY = 0;
  if (dir.y > 0) {
    bumpY = 1;
  }

  var xCollideBlock = this.map.tileMap[tileLoc.x + bumpX][tileLoc.y];
  if (BlockType.isCollision(xCollideBlock)) {
    return xCollideBlock;
  }

  return this.map.tileMap[tileLoc.x][tileLoc.y + bumpY];
};

/**
 * Detect the collision from loc proceeding in dir direction. If collision,
 * return the furthest the player can travel from loc in dir.
 *
 * @param {Vec2} loc
 * @param {Vec2} dir
 * @return {Vec2} new location to move to
 */
Level.prototype.getMovementWithCollision = function(loc, dir) {
  if (dir.x === 0 && dir.y === 0) {
    return loc;
  }

  var newLoc = loc.add(dir);
  var newDir = new Vec2(dir.x, dir.y);

  var tileLoc = this.getTileLoc(newLoc);
  var overlapStrictness = this.tileSize * 0.01;

  var overlapX = newLoc.x - tileLoc.x * this.tileSize > overlapStrictness;
  var overlapY = newLoc.y - tileLoc.y * this.tileSize > overlapStrictness;

  var xCollide = BlockType.isCollision(this.getCollision(loc, newDir));
  var yCollide = xCollide;

  if (overlapY) {
    var xCollideBlock = this.getCollision(
      loc.add(new Vec2(0, this.tileSize)), newDir);
    xCollide = xCollide || BlockType.isCollision(xCollideBlock);
    // BlockType.isCollision(
    //   this.map.tileMap[tileLoc.x + bumpX][tileLoc.y + 1]);
  }

  if (overlapX) {
    var yCollideBlock = this.getCollision(
      loc.add(new Vec2(this.tileSize, 0)), newDir);
    yCollide = yCollide || BlockType.isCollision(yCollideBlock);
    //  BlockType.isCollision(
    //    this.map.tileMap[tileLoc.x + 1][tileLoc.y + bumpY]);
  }

  if (xCollide) {
    newDir.x = Math.round(loc.x / this.tileSize) * this.tileSize - loc.x;
  }

  if (yCollide) {
    newDir.y = Math.round(loc.y / this.tileSize) * this.tileSize - loc.y;
  }

  return loc.add(newDir);
};

/**
 * Load in the tile textures required
 */
Level.prototype.loadTextures = function() {
  this.wallTexture = PIXI.Texture.fromImage('assets/wall.png');
  this.goalTexture = PIXI.Texture.fromImage('assets/goal.png');
  this.emptyTexture = PIXI.Texture.fromImage('assets/empty.png');
};

/**
 * Generate a new map of tiles
 */
Level.prototype.generateMap = function() {
  this.map.generate();
};

/**
 * Create the tiles corresponding to the map
 */
Level.prototype.createTiles = function() {
  this.container.removeChildren();

  for (var tileX = 0; tileX < this.map.width; tileX++) {
    for (var tileY = 0; tileY < this.map.height; tileY++) {
      var x = tileX * this.tileSize;
      var y = tileY * this.tileSize;
      var type = null;

      switch (this.map.tileMap[tileX][tileY]) {
      case BlockType.EMPTY:
      case BlockType.BLOCK:
        tile = new PIXI.Sprite(this.emptyTexture);
        break;
      case BlockType.WALL:
        tile = new PIXI.Sprite(this.wallTexture);
        break;
      case BlockType.GOAL:
        tile = new PIXI.Sprite(this.goalTexture);
        break;
      default:
        throw new Error('Unknown type found');
      }

      tile.position.x = x;
      tile.position.y = y;
      tile.width = this.tileSize;
      tile.height = this.tileSize;
      this.container.addChild(tile);
    }
  }
};

/**
 * Create the ice block
 */
Level.prototype.createBlock = function() {
  if (this.block) {
    this.block.remove();
  }
  for (var x = 0; x < this.map.width; x++) {
    for (var y = 0; y < this.map.height; y++) {
      if (this.map.tileMap[x][y] !== BlockType.BLOCK) {
        continue;
      }
      this.block = new Block(this.stage, this.game, this,
                             new Vec2(x, y), this.tileSize);
      return;
    }
  }
};

/**
 * @return {Vec2} a random empty location
 */
Level.prototype.getRandomEmptyLocation = function() {
  var possibilities = [];
  for (var x = 0; x < this.map.width; x++) {
    for (var y = 0; y < this.map.height; y++) {
      if (this.map.tileMap[x][y] === BlockType.EMPTY) {
        possibilities.push(new Vec2(x * this.tileSize, y * this.tileSize));
      }
    }
  }
  return Utils.randElement(possibilities);
};

/**
 * Update for a time step
 *
 * @param {number} dt
 */
Level.prototype.update = function(dt) {
  this.block.update(dt);
};
