const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const rows = 5;
const cols = 5;
var side = 50;
canvas.width = cols * side * Math.sqrt(3);
canvas.height = rows * 1.5 * side;

const paths = [];

var dy = -1;
for (let i = 0; i < (rows + 1) * (cols + 1); i++) {
  let dx = i % (cols + 1);
  dy += dx ? 0 : 1;
  dx += dy % 2 ? -.5 : 0;
  let cx = dx * (side * Math.sqrt(3)) + side / 2 * Math.sqrt(3);
  let cy = (dy - .5) * (side * 1.5) + side;
  let path = new Path2D();
  for (let j = 0; j < 6; j++) {
    let x = Math.cos(Math.PI / 3 * j + Math.PI / 6) * side + cx;
    let y = Math.sin(Math.PI / 3 * j + Math.PI / 6) * side + cy;
    if (j) {
      path.lineTo(x, y);
    } else {
      path.moveTo(x, y);
    }
  }
  path.closePath();
  ctx.fillStyle = `hsl(${10*i},50%,50%)`;
  ctx.fill(path);
  paths.push(path);
}

canvas.addEventListener('mousemove', e => {
  let bound = canvas.getBoundingClientRect();
  let x = e.pageX - bound.left;
  let y = e.pageY - bound.top;
  paths.forEach((path, index) => {
    if (ctx.isPointInPath(path, x, y)) {
      console.log(index);
    }
  });
});

document.body.appendChild(canvas);