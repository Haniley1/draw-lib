import Drawer from "./Drawer.js";

export default class Figure {
  constructor(ctx, points) {
    this.ctx = ctx
    this.points = points;
    this.draw = new Drawer(ctx)
  }

  drawFigure = () => {
    this.drawInsideFigure()
    this.drawFigureBorder()
    this.drawFigurePoints()
  }

  drawInsideFigure = () => {
    const ctx = this.ctx;
    const points = this.points

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++) {
      const isLast = i + 1 === points.length;
      const nextPoint = points[isLast ? 0 : i + 1];
      ctx.lineTo(nextPoint.x, nextPoint.y);
    }

    ctx.fillStyle = "#ed514f82";
    ctx.fill();
    ctx.closePath()
  };

  drawFigureBorder = () => {
    const ctx = this.ctx;
    const points = this.points

    ctx.beginPath()
    // ctx.moveTo(points[0].x, points[0].y)
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const isLast = i + 1 === points.length
      const nextPoint = points[(isLast ? 0 : i + 1)]
      this.draw.drawStrokeLine(point.x, point.y, nextPoint.x, nextPoint.y, 'ready')
    }

    ctx.strokeStyle = '#ed514f'
    ctx.stroke()
    ctx.closePath()
  }

  drawFigurePoints = () => {
    const points = this.points
    const paths = []

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const isLast = i + 1 === points.length
      const nextPoint = points[(isLast ? 0 : i + 1)]

      const anglePointType = point.hover ? 'hoverReady' : 'ready'
      const anglePointPath = this.draw.drawFillPoint(point.x, point.y, anglePointType)
      const middlePointPath = this.draw.drawFillPoint((point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2, 'middle')

      paths.push({path: anglePointPath, type: 'angle'}, {path: middlePointPath, type: 'middle'})
    }

    return paths
  }
}
