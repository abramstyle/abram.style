import { useEffect, useRef } from 'react'
import { VERT, FRAG } from '../lib/shaders'

/** Animated aurora rendered into a full-screen WebGL canvas. */
export default function Aurora({ reduce }: { reduce: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const glOpts: WebGLContextAttributes = { antialias: true, alpha: false, preserveDrawingBuffer: true }
    const gl = (canvas.getContext('webgl', glOpts) ||
      canvas.getContext('experimental-webgl', glOpts)) as WebGLRenderingContext | null
    if (!gl) {
      canvas.style.display = 'none' // CSS fallback atmosphere remains
      return
    }

    const compile = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('shader:', gl.getShaderInfoLog(s))
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('link:', gl.getProgramInfoLog(prog))
      canvas.style.display = 'none'
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize, { passive: true })

    const mouse = [0, 0]
    const target = [0, 0]
    const onPointer = (e: PointerEvent) => {
      target[0] = (e.clientX / window.innerWidth) * 2 - 1
      target[1] = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const draw = (time: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, time)
      gl.uniform2f(uMouse, mouse[0], mouse[1])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    resize()
    draw(0) // paint an immediate frame so the sky is never blank

    let raf = 0
    let start: number | null = null
    const frame = (t: number) => {
      if (start === null) start = t
      const time = (t - start) / 1000
      mouse[0] += (target[0] - mouse[0]) * 0.04
      mouse[1] += (target[1] - mouse[1]) * 0.04
      draw(time)
      raf = requestAnimationFrame(frame)
    }
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else {
        start = null
        raf = requestAnimationFrame(frame)
      }
    }

    if (reduce) {
      draw(9) // single calm frame, no loop
    } else {
      raf = requestAnimationFrame(frame)
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      // intentionally not calling loseContext() — keeps the canvas reusable on dev remount
    }
  }, [reduce])

  return <canvas id="sky" ref={canvasRef} aria-hidden="true" />
}
