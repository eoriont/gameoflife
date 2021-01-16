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

var pixelsWidth = 100, pixelsHeight = 100;
var paused = true

function setup() {
  let c = createCanvas(document.body.clientWidth, document.body.clientHeight-50);
  c.parent("parent")

  cellSize = [width/pixelsWidth, height/pixelsWidth]

  colorMode(HSB);

  for (let i = 0; i < pixelsWidth; i++) {
    for (let j = 0; j < pixelsWidth; j++) {
      grid[getCellIndex(i, j)] = new Cell(i, j, false);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let pause = document.getElementById("start")
  pause.addEventListener("click", () => {
    if (!paused) {
      paused = true
      pause.classList = "btn btn-success"
      pause.innerHTML = "Start"
    } else {
      paused = false
      pause.classList = "btn btn-danger"
      pause.innerHTML = "Stop"
    }
  })

  let clear = document.getElementById("reset")
  clear.addEventListener("click", () => {
    clearGrid()
  })
})
var cellSize;

function draw() {
  if (frameCount % 1 == 0 && !paused) {
    drawThing();
  }
  render();

  if (mouseIsPressed) {
    noFill()
    stroke("white")
    rect(clickpos.x, clickpos.y, mouseX-clickpos.x, mouseY-clickpos.y)
  }
  if (released) {
    released = false;
    let p = pxToCell(nextPos.x, nextPos.y);
    let p1 = pxToCell(clickpos.x, clickpos.y);

    for (let i = 0; i < Math.abs(p1.x - p.x); i++) {
      for (let j = 0; j < Math.abs(p1.y - p.y); j++) {
        getCell(i+min(p.x, p1.x), j+min(p.y, p1.y)).on = true;
      }
    }
  }
}

function getCellIndex(x, y) {
  return y + (x*pixelsWidth)
}

function getCell(x, y) {
  return grid[getCellIndex(x, y)];
}

function pxToCell(x, y) {
  let newx = Math.floor(x/cellSize[0]);
  let newy = Math.floor(y/cellSize[1]);
  return {x: constrain(newx, 0, pixelsWidth), y: constrain(newy, 0,pixelsHeight)};
}

var released = false;

function mouseReleased(e) {
  nextPos = {x: e.clientX, y: e.clientY};
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
  noStroke()
  for (let cell of grid) {
    if (cell.on) fill(getColor(cell.x, cell.y), 255, 100, 1);
    else fill(0)
    rect(cell.x*cellSize[0], cell.y*cellSize[1], cellSize[0], cellSize[1]);
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
