function Game() {
  this.width = 512;
  this.height = 448;
  this.tileSize = 16;

  this.renderer = new PIXI.autoDetectRenderer(this.width, this.height);

  this.renderer.view.classList.add('vertical-center');
  document.body.appendChild(this.renderer.view);

  this.stage = new PIXI.Container();

  this.level = new Level(this.stage, this, this.width, this.height,
                         this.tileSize);
  this.controller = new Controller();
  this.player = new Player(this.stage, this.level, this.tileSize);

  this.lastRender = Date.now();
  this.animate = this.animate.bind(this);
  window.requestAnimationFrame(this.animate);
}

/**
 * Render one frame
 */
Game.prototype.animate = function() {
  window.requestAnimationFrame(this.animate);
  var dt = Date.now() - this.lastRender;
  var dir = this.controller.getDirection(0.1 * dt);
  this.player.move(dir);
  this.level.update(dt);
  this.renderer.render(this.stage);

  this.lastRender += dt;
};

/**
 * Win the current level, moving on and increasing difficulty
 */
Game.prototype.win = function() {
  this.level.map.difficulty += 5;
  this.level.regenerate();
  this.player.loc = this.level.getRandomEmptyLocation();
};
