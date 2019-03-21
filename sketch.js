var grid = [];
class Cell {
  constructor(x, y, on) {
    this.x = x;
    this.y = y;
    this.on = on;
  }

  getNeighbors() {
    let onNeighbors = 0;
    let ns = [];
    ns.push(getCell(this.x - 1, this.y - 1))
    ns.push(getCell(this.x - 1, this.y))
    ns.push(getCell(this.x - 1, this.y + 1))
    ns.push(getCell(this.x, this.y - 1))
    ns.push(getCell(this.x, this.y + 1))
    ns.push(getCell(this.x + 1, this.y - 1))
    ns.push(getCell(this.x + 1, this.y))
    ns.push(getCell(this.x + 1, this.y + 1))
    for (let i of ns) {
      if (i != undefined) if (i.on) onNeighbors += 1;
    }
    return onNeighbors;
  }
}

var pixelsWidth = 100;
var pauseButton, paused;
var clearButton;

function setup() {
  createCanvas(500, 500);

  pauseButton = createButton('Pause');
  pauseButton.mousePressed(updatePause);

  clearButton = createButton('Clear');
  clearButton.mousePressed(clearGrid);

  colorMode(HSB);

  pause = false;

  for (let i = 0; i < pixelsWidth; i++) {
    for (let j = 0; j < pixelsWidth; j++) {
      grid[getCellIndex(i, j)] = new Cell(i, j, false);
    }
  }
}
const cellSize = 500/pixelsWidth;

function draw() {
  if (frameCount % 1 == 0 && !paused) {
    drawThing();
  }
  render();

  if (released) {
    released = false;
    let newpos = pxToCell(nextPos.x, nextPos.y);
    let newpos2 = pxToCell(clickpos.x, clickpos.y);

    for (let i = 0; i < Math.abs(newpos2.x - newpos.x); i++) {
      for (let j = 0; j < Math.abs(newpos2.y - newpos.y); j++) {
        getCell(i+newpos2.x, j+newpos2.y).on = true;
      }
    }
  }
}

function updatePause() {
  paused = !paused;
}

function getCellIndex(x, y) {
  return y + (x*pixelsWidth)
}

function getCell(x, y) {
  return grid[getCellIndex(x, y)];
}

function mouseMoved(e) {
  mMove(e)
}

function mouseDragged(e) {
  mMove(e)
}

function mMove(e) {
  nextPos = {x: e.clientX, y: e.clientY};
}

function pxToCell(x, y) {
  let newx = Math.round(x/cellSize);
  let newy = Math.round(y/cellSize);

  return {x: newx, y: newy};
}

var released = false;

function mouseReleased(e) {
  released = true;
}

var clickpos = {x: 0, y: 0};
var nextPos = {x: 0, y: 0};
function mousePressed(e) {
  clickpos = {x: e.clientX, y: e.clientY};
}

function clearGrid() {
  for (let i = 0; i < pixelsWidth; i++) {
    for (let j = 0; j < pixelsWidth; j++) {
      grid[getCellIndex(i, j)] = new Cell(i, j, false);
    }
  }
}

function render() {
  for (let cell of grid) {
    if (cell.on) fill(getColor(cell.x, cell.y), 255, 100, 1);
    else fill(0)
    rect(cell.x*cellSize, cell.y*cellSize, cellSize, cellSize);
  }
}

function getColor(x, y) {
  let col = (x+y)*2;
  return col;
}

function drawThing() {
  background(0);
  noStroke();
  var newgrid = [];
  for (let cell of grid) {
    var newcell = new Cell(cell.x, cell.y, cell.on);

    let ns = cell.getNeighbors();
    if (ns < 2) {
      newcell.on = false;
    }
    if ((ns == 2 || ns == 3) && cell.on) {
      newcell.on = true;
    }
    if (ns > 3) {
      newcell.on = false;
    }
    if (ns == 3 && !cell.on) {
      newcell.on = true;
    }
    newgrid.push(newcell)
  }
  grid = newgrid;
}
