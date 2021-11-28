import Figure from "./Figure";
import { pointTypes, lineTypes } from "./Constants";

export default class Drawer {
  constructor(ctx, cursorX, cursorY) {
    this.ctx = ctx;
    ctx.lineWidth = 4
    this.cursor = {}
    this.cursor.x = cursorX
    this.cursor.y = cursorY
  }

  drawFillPoint = (x, y, type) => {
    const ctx = this.ctx
    const point = new Path2D()
    point.arc(x, y, (type === 'middle' ? 5 : 7), 0, Math.PI * 2, true);

    ctx.fillStyle = pointTypes[type] || 'black'
    ctx.fill(point);
    return point
  }

  drawLine = (startX, startY, endX, endY) => {
    const ctx = this.ctx
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }

  drawDashLine = (startX, startY, endX, endY) => {
    const ctx = this.ctx
    ctx.setLineDash([20, 10]);
    this.drawLine(startX, startY, endX, endY)
    ctx.stroke();
    ctx.closePath();
  }

  drawStrokeLine = (startX, startY, endX, endY, type) => {
    const ctx = this.ctx
    ctx.setLineDash([]);
    this.drawLine(startX, startY, endX, endY)
    ctx.strokeStyle = lineTypes[type] || 'black'
    ctx.stroke();
    ctx.closePath();
  }

  drawTail = (points = [], cursor) => {
    const length = points.length
    const firstPoint = points[0]
    this.drawDashLine(firstPoint.x, firstPoint.y, cursor.x, cursor.y)
    if (points.length > 1) {
      const lastPoint = points[length - 1]
      this.drawDashLine(lastPoint.x, lastPoint.y, cursor.x, cursor.y)
    }
  }

  drawAll = (points = [], figures = [], width, height) => {
    this.clearCanvas(width, height)

    for (let i = 0; i < figures.length; i++) {
      const figure = new Figure(this.ctx, figures[i])
      figure.drawFigure()
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const isLast = i + 1 === points.length
      const nextPoint = points[(isLast ? 0 : i + 1)]
      const type = point.active ? 'active' : point.hover ? 'hover' : undefined

      this.drawFillPoint(point.x, point.y, type)
      this.drawStrokeLine(point.x, point.y, nextPoint.x, nextPoint.y)
    }
  }

  clearCanvas = (width, height) => {
    this.ctx.clearRect(0, 0, width, height)
  }
}