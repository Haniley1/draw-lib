<template>
  <div class="canvas-wrap" ref="draw-wrap">
    <canvas
      ref="draw"
      :width="screen.width"
      :height="screen.height"
      @resize="handleResize"
      @click="handleClick"
      @mousemove="handleMousemove"
      @mouseout="handleMouseout"
      @mousedown="handleMousedown"
      @mouseup="handleMouseup"
    />
    <PointMenu
      v-if="isShowMenu"
      :menuStyle="menuStyle"
      @close="closeMenu"
      @end-point="stopDrawing"
    />
  </div>
  <button @click="deleteAll">Очистить</button>
  <p>
    <span>Drag: {{ drag }}</span>
  </p>
  <p>
    <span>X: {{ cursor.x }}</span>
    <b> || </b>
    <span>Y: {{ cursor.y }}</span>
  </p>
</template>
<script>
import Drawer from "@/classes/Drawer";
import PointMenu from "@/components/PointMenu";
export default {
  name: "Draw",
  components: { PointMenu },
  data() {
    return {
      cursor: {
        x: 0,
        y: 0,
      },
      screen: {
        width: 0,
        height: 0,
      },
      mousedown: false,
      drag: false,
      canvas: null,
      ctx: null,
      drawing: false,
      canvasObjects: {
        points: [],
        figures: [],
        activePoint: {},
        draggablePoint: {},
        paths: []
      },
      isShowMenu: false,
      menuStyle: {},
    };
  },
  mounted() {
    this.canvas = this.$refs.draw;
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.screen.width = parseInt(this.canvas.offsetWidth);
      this.screen.height = parseInt(this.canvas.offsetHeight);
    },
    handleClick(event) {
      this.drawing = true;
      const point = this.findPoint(event.clientX, event.clientY);
      if (point) {
        this.canvasObjects.activePoint = point
        point.active = true;
        this.handleMousemove(event);
        this.showMenu(event.clientX, event.clientY);
      } else {
        const draw = new Drawer(this.ctx);
        const anglePointPath = draw.drawFillPoint(event.clientX, event.clientY);

        this.canvasObjects.points.push({
          x: event.clientX,
          y: event.clientY,
          path: anglePointPath,
          active: false,
          hover: false,
        });
        console.log(this.ctx.isPointInPath(anglePointPath, event.clientX, event.clientY, 'evenodd'))
        this.canvasObjects.paths.push(anglePointPath)
        this.handleMousemove(event)
      }
    },
    handleMousemove(event) {
      this.cursor = { x: event.clientX, y: event.clientY };
      this.findPoint(event.clientX, event.clientY);
      if (this.drag) {
        this.canvasObjects.draggablePoint.x = event.clientX
        this.canvasObjects.draggablePoint.y = event.clientY
      }

      const draw = new Drawer(this.ctx);
      draw.drawAll(
        this.canvasObjects.points,
        this.canvasObjects.figures,
        this.screen.width,
        this.screen.height,
        this.mousedown
      );
      if (this.drawing && !this.drag) {
        draw.drawTail(this.canvasObjects.points, {
          x: event.clientX,
          y: event.clientY,
        });
      }

    },
    handleMouseout() {
      this.cursor = {x: 0, y: 0}
    },
    handleMousedown(event) {
      this.mousedown = true;
      const point = this.findPoint(event.clientX, event.clientY)
      if (point) {
        this.drag = true
        this.canvasObjects.draggablePoint = point
      }
    },
    handleMouseup() {
      this.mousedown = false;
      this.drag = false
      this.canvasObjects.draggablePoint = {}
    },
    findPoint(cursorX, cursorY) {
      const cvObj = this.canvasObjects
      const [points, figures, paths] = [cvObj.points, cvObj.figures, cvObj.paths]

      for (let path of paths) {
        if (this.ctx.isPointInPath(path, cursorX, cursorY)) {
          console.log('point finded')
          let point = points.find(item => item.path === path)
          if (!point) {
            for (let figure of figures) {
              point = figure.find(item => item.path === path)
              if (point) {
                point.hover = true
                return point
              }
            }
          } else {
            point.hover = true
            return point
          }
        }
      }

      this.clearPointsStatus()
      return false
    },
    clearPointsStatus() {
      for (let item of this.canvasObjects.points) {
        item.hover = item.active = false
      }
      for (let figure of this.canvasObjects.figures) {
        for (let item of figure) {
          item.hover = item.active = false
        }
      }
    },
    showMenu(x, y) {
      this.isShowMenu = true;
      this.menuStyle = { top: `${y + 5}px`, left: `${x + 5}px` };
    },
    closeMenu() {
      this.isShowMenu = false
      this.canvasObjects.activePoint.active = this.canvasObjects.activePoint.hover = false
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
      this.drawing = false;
      this.canvasObjects.points = []
    },
    deleteAll() {
      this.clearCanvas()
      this.canvasObjects.figures = []
    },
    stopDrawing() {
      const cvObj = this.canvasObjects
      this.closeMenu()
      this.drawing = false;
      cvObj.figures.push(cvObj.points)
      this.clearCanvas()

      const draw = new Drawer(this.ctx)
      draw.drawAll(cvObj.points, cvObj.figures, this.screen.width, this.screen.height)
    },
  },
};
</script>
<style scoped>
div.canvas-wrap {
  height: 700px;
  width: 100%;
  /* margin: 0 auto; */
}
canvas {
  border-bottom: 2px solid black;
  width: calc(100%);
  height: 100%;
}
</style>