class Circle {
  constructor({ origin, speed, color, angle, context }) {
    this.origin = origin
    this.position = { ...this.origin }
    this.color = color
    this.speed = speed
    this.angle = angle
    this.context = context
    this.renderCount = 0
  }

  draw() {
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
    this.context.fill()
  }

  move() {
    this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
    this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
    this.renderCount++
  }
}

class Boom {
  constructor({ origin, context, circleCount = 10, area }) {
    this.origin = origin
    this.context = context
    this.circleCount = circleCount
    this.area = area
    this.stop = false
    this.circles = []
  }

  randomArray(range) {
    const length = range.length
    const randomIndex = Math.floor(length * Math.random())
    return range[randomIndex]
  }

  randomColor() {
    const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
  }

  randomRange(start, end) {
    return (end - start) * Math.random() + start
  }

  init() {
    for (let i = 0; i < this.circleCount; i++) {
      const circle = new Circle({
        context: this.context,
        origin: this.origin,
        color: this.randomColor(),
        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
        speed: this.randomRange(1, 6)
      })
      this.circles.push(circle)
    }
  }

  move() {
    this.circles.forEach((circle, index) => {
      if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
        return this.circles.splice(index, 1)
      }
      circle.move()
    })
    if (this.circles.length == 0) {
      this.stop = true
    }
  }

  draw() {
    this.circles.forEach(circle => circle.draw())
  }
}

// ===== 新的 Trail 类（直接替换原 Trail 类） =====
class Trail {
  constructor({ context, maxTail = 80, color = 'rgba(255,255,255,0.5)' }) {
    this.context   = context
    this.maxTail   = maxTail        // 最大轨迹长度
    this.color     = color
    this.history   = []             // 存点
    this.currTail  = 0              // 当前允许的长度（动态衰减）
  }

  /* 压入新点 */
  push(x, y) {
    this.history.push({ x, y })
    // 每移动就“补满”长度
    this.currTail = this.maxTail
  }

  /* 每帧让长度自然衰减（可调整衰减速度） */
  update() {
    // 1px/帧 的衰减速度，可自行改成 0.5 或 2
    this.currTail = Math.max(0, this.currTail - 2)
  }

  /* 绘制 */
  draw() {
    this.update()           // 先衰减
    if (this.currTail <= 0 || this.history.length < 2) {
      this.history = []     // 彻底消失时清空点列
      return
    }

    // 从最新点往前回溯，直到总长度 <= currTail
    let total = 0
    const pts = [this.history[this.history.length - 1]]
    for (let i = this.history.length - 2; i >= 0; i--) {
      const dx = pts[pts.length - 1].x - this.history[i].x
      const dy = pts[pts.length - 1].y - this.history[i].y
      total += Math.hypot(dx, dy)
      pts.push(this.history[i])
      if (total >= this.currTail) break
    }
    pts.reverse()

    // 绘制
    const ctx = this.context
    ctx.save()
    ctx.strokeStyle = this.color
    ctx.lineWidth   = 2.5
    ctx.lineCap     = 'round'
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.stroke()
    ctx.restore()
  }
}

class CursorSpecialEffects {
  constructor() {
    this.computerCanvas = document.createElement('canvas')
    this.renderCanvas = document.createElement('canvas')

    this.computerContext = this.computerCanvas.getContext('2d')
    this.renderContext = this.renderCanvas.getContext('2d')

    this.globalWidth = window.innerWidth
    this.globalHeight = window.innerHeight

    this.booms = []
    this.running = false

    this.trail = new Trail({ context: this.computerContext })
  }

  handleMouseDown(e) {
    const boom = new Boom({
      origin: { x: e.clientX, y: e.clientY },
      context: this.computerContext,
      area: {
        width: this.globalWidth,
        height: this.globalHeight
      }
    })
    boom.init()
    this.booms.push(boom)
    this.running || this.run()
  }

  handleMouseMove(e) {
    this.trail.push(e.clientX, e.clientY)
  }

  handlePageHide() {
    this.booms = []
    this.trail.points = []
    this.running = false
  }

  init() {
    const style = this.renderCanvas.style
    style.position = 'fixed'
    style.top = style.left = 0
    style.zIndex = '999999999999999999999999999999999999999999'
    style.pointerEvents = 'none'

    style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
    style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

    document.body.append(this.renderCanvas)

    window.addEventListener('mousedown', this.handleMouseDown.bind(this))
    window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    window.addEventListener('pagehide', this.handlePageHide.bind(this))
  }

  run() {
    this.running = true
    if (this.booms.length === 0 && this.trail.history.length === 0) {
      this.running = false
      return
    }

    requestAnimationFrame(this.run.bind(this))

    this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
    this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

    this.trail.draw()

    this.booms.forEach((boom, index) => {
      if (boom.stop) {
        return this.booms.splice(index, 1)
      }
      boom.move()
      boom.draw()
    })
    this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
  }
}

const cursorSpecialEffects = new CursorSpecialEffects()
cursorSpecialEffects.init()
