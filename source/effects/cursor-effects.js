class CursorTrail {
  constructor(options = {}) {
    this.maxLength = options.maxLength || 40
    this.color = options.color || 'rgba(255, 255, 255, 0.6)'
    this.lineWidth = options.lineWidth || 2.5
    this.fadeSpeed = options.fadeSpeed || 1.5

    this.points = []
    this.canvas = null
    this.ctx = null
    this.running = false
    this.boundAnimate = this.animate.bind(this)

    this.init()
  }

  init() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    const style = this.canvas.style
    style.position = 'fixed'
    style.top = '0'
    style.left = '0'
    style.width = '100%'
    style.height = '100%'
    style.pointerEvents = 'none'
    style.zIndex = '2147483647'

    this.resize()
    document.body.appendChild(this.canvas)

    window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    window.addEventListener('click', this.handleClick.bind(this))
    window.addEventListener('resize', this.resize.bind(this))
    window.addEventListener('pagehide', this.destroy.bind(this))
    window.addEventListener('mouseleave', this.clear.bind(this))
  }

  handleMouseMove(e) {
    this.points.push({ x: e.clientX, y: e.clientY, alpha: 1 })
    if (this.points.length > this.maxLength) {
      this.points.shift()
    }
    if (!this.running) {
      this.running = true
      requestAnimationFrame(this.boundAnimate)
    }
  }

  handleClick(e) {
    BurstParticle.create(this.ctx, e.clientX, e.clientY)
    if (!this.running) {
      this.running = true
      requestAnimationFrame(this.boundAnimate)
    }
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  clear() {
    this.points = []
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // fade trail points
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].alpha -= this.fadeSpeed / this.maxLength
    }
    while (this.points.length > 0 && this.points[0].alpha <= 0) {
      this.points.shift()
    }

    // draw trail
    if (this.points.length >= 2) {
      this.ctx.save()
      this.ctx.strokeStyle = this.color
      this.ctx.lineWidth = this.lineWidth
      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'

      for (let i = 1; i < this.points.length; i++) {
        const p0 = this.points[i - 1]
        const p1 = this.points[i]
        this.ctx.globalAlpha = Math.max(0, p1.alpha)
        this.ctx.beginPath()
        this.ctx.moveTo(p0.x, p0.y)
        this.ctx.lineTo(p1.x, p1.y)
        this.ctx.stroke()
      }
      this.ctx.restore()
    }

    // update and draw particles
    BurstParticle.updateAll()
    BurstParticle.drawAll(this.ctx)

    if (BurstParticle.hasActive() || this.points.length > 0) {
      requestAnimationFrame(this.boundAnimate)
    } else {
      this.running = false
    }
  }

  destroy() {
    this.running = false
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }
  }
}

// ========== Burst Particles ==========
class BurstParticle {
  static pool = []
  static colors = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

  constructor(x, y, vx, vy, color, size) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.color = color
    this.size = size
    this.alpha = 1
    this.decay = 0.02 + Math.random() * 0.02
    this.dead = false
  }

  static randomColor() {
    return '#' + this.colors[Math.floor(Math.random() * this.colors.length)]
      + this.colors[Math.floor(Math.random() * this.colors.length)]
      + this.colors[Math.floor(Math.random() * this.colors.length)]
      + this.colors[Math.floor(Math.random() * this.colors.length)]
      + this.colors[Math.floor(Math.random() * this.colors.length)]
      + this.colors[Math.floor(Math.random() * this.colors.length)]
  }

  static create(ctx, x, y) {
    const count = 12
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 2 + Math.random() * 4
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      const color = this.randomColor()
      const size = 2 + Math.random() * 2
      this.pool.push(new BurstParticle(x, y, vx, vy, color, size))
    }
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.1  // gravity
    this.vx *= 0.98
    this.alpha -= this.decay
    if (this.alpha <= 0) this.dead = true
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  static updateAll() {
    for (let i = this.pool.length - 1; i >= 0; i--) {
      this.pool[i].update()
      if (this.pool[i].dead) this.pool.splice(i, 1)
    }
  }

  static drawAll(ctx) {
    for (const p of this.pool) p.draw(ctx)
  }

  static hasActive() {
    return this.pool.length > 0
  }
}

// Initialize
const cursorTrail = new CursorTrail({
  maxLength: 40,
  color: 'rgba(255, 255, 255, 0.7)',
  lineWidth: 2.5,
  fadeSpeed: 1.5,
})