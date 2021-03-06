var game = {

  
  debug: false,

  gridSize: 8,
  mineCount: 10,

  mines: [],

 
  init: function () {
    game.continue();
  },

  
  continue: function () {
    this.bindEvents();
    this.renderGrid();
    this.determineMines();
  },

  
  bindEvents: function () {
    $('#actionNew').click($.proxy(this.newGame, this));
    $('#actionValidate').click($.proxy(this.validateGame, this));
    $('#actionCheat').click($.proxy(this.showMines, this));
  },

 
  renderGrid: function () {
    for (y = 1; y <= this.gridSize; y++) {
     
      var row = $('<div class="row"></div>').appendTo('#board');

      
      for (x = 1; x <= this.gridSize; x++) {
        var cell = $('<div></div>', {
          'class': 'cell',
          'data-x': x,
          'data-y': y,
          on: {
            click: this.onCellClicked
          }
        }).appendTo(row);
      }
    }
  },

  
  determineMines: function () {
    for (i = 0; i <= this.mineCount; i++) {
      var x = this.getRand(1, this.gridSize);
      var y = this.getRand(1, this.gridSize);
      var coords = x + 'x' + y;

      while ($.inArray(coords, this.mines) == -1) {
        this.mines.push(coords);

        if (this.debug) {
          this.showMines();
        }
      }
    }
  },

  
  showMines: function (e) {
    if (typeof e != 'undefined') e.preventDefault();

    for (i in this.mines) {
      var coords = this.mines[i].split('x');
      var x = coords[0], y = coords[1];
      $('div[data-x="' + x + '"][data-y="' + y + '"]').addClass('incorrect');
    }
  },

 
  getSurroundingMines: function (x, y) {
    var count = 0;
    var mines = [];
    var cells = [];

   
    for (i in this.mines) {
      var mine = this.mines[i];
      var coords = mine.split('x');
      var x2 = parseInt(coords[0]), y2 = parseInt(coords[1]);

      var xDistance = Math.abs(x - x2);
      var yDistance = Math.abs(y - y2);

      if (xDistance <= 1 && yDistance <= 1) {
        count++;

        mines.push(mine);
      }
    }

    
    if (count === 0) {
      // Top left
      var cell = this.getCellByCoords(x - 1, y - 1);
      if (cell.length) cells.push(cell);

      // Top
      var cell = this.getCellByCoords(x, y - 1);
      if (cell.length) cells.push(cell);

      // Top right
      var cell = this.getCellByCoords(x + 1, y - 1);
      if (cell.length) cells.push(cell);

      // Right
      var cell = this.getCellByCoords(x + 1, y);
      if (cell.length) cells.push(cell);

      // Bottom right
      var cell = this.getCellByCoords(x + 1, y + 1);
      if (cell.length) cells.push(cell);

      // Bottom
      var cell = this.getCellByCoords(x, y + 1);
      if (cell.length) cells.push(cell);

      // Bottom left
      var cell = this.getCellByCoords(x - 1, y + 1);
      if (cell.length) cells.push(cell);

      // Left
      var cell = this.getCellByCoords(x - 1, y);
      if (cell.length) cells.push(cell);
    }

    return {mines: mines, cells: cells};
  },

 
  endGame: function () {
    alert('Game is over!');

    this.newGame();
  },

  
  newGame: function (e) {
    if (typeof e != 'undefined') e.preventDefault();

    var gridSize = parseInt(prompt('How big do you want your grid? It is currently ' + this.gridSize + 'x' + this.gridSize + "\nEntering 10 gives you a 10x10 grid."));
    var mineCount = parseInt(prompt("How many mines do you want in your game?"));

    if (gridSize > 0)
      this.gridSize = gridSize;

    if (mineCount > 0) {
      this.mineCount = mineCount;
    }

    $('#board div').remove();

    this.mines = [];
    this.continue();
  },

  // Validate game
  validateGame: function (e) {
    e.preventDefault();

    if ($('.correct').length + $('.incorrect').length == (this.gridSize * this.gridSize)) {
      alert('Winner!');

      this.newGame();
    } else {
      this.endGame();
    }
  },

  
  getCellByCoords: function (x, y) {
    return $('div[data-x="' + x + '"][data-y="' + y + '"]');
  },

  onCellClicked: function () {
    var cell = $(this);
    var x = parseInt(cell.attr('data-x')), y = parseInt(cell.attr('data-y'));
    var coords = x + 'x' + y;

   
    if ($.inArray(coords, game.mines) == -1) {
      var surrounding = game.getSurroundingMines(x, y);

      cell.addClass('correct');
      cell.html(surrounding.mines.length);

      
      if (surrounding.mines.length === 0) {
        for (i in surrounding.cells) {
          surrounding.cells[i].addClass('correct');
        }
      }
    } else {
      cell.addClass('incorrect');
      game.endGame();
    }
  },

  
  getRand: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

};

$(document).ready(game.init);
