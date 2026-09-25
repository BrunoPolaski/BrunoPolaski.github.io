const VERT = 'attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'

/** Shared GLSL helpers: value noise, fbm and a per-pixel grain hash. */
export const GLSL_NOISE = /* glsl */ `
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
  return s
}

/**
 * Renders a full-screen fragment shader into a canvas.
 * Uniforms: u_res (device px), u_time (s), u_pointer (-1..1, eased).
 * `uniforms` adds float uniforms read every frame (e.g. from props).
 * Without WebGL the canvas stays transparent, so give its parent a background.
 */
export function useShader(
  canvas: Ref<HTMLCanvasElement | undefined>,
  fragment: string,
  uniforms: () => Record<string, number> = () => ({}),
) {
  let gl: WebGLRenderingContext | null = null
  let uRes: WebGLUniformLocation | null = null
  let uTime: WebGLUniformLocation | null = null
  let uPointer: WebGLUniformLocation | null = null
  let prog: WebGLProgram | null = null
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  // ponytail: DPR capped at 1.5, fbm per pixel is the cost; lower it if big canvases stutter
  useFrameLoop(canvas, {
    setup(el) {
      gl = el.getContext('webgl', { premultipliedAlpha: true, antialias: false })
      if (!gl) return false
      prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, `precision highp float;\n${fragment}`))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog))
        return false
      }
      gl.useProgram(prog)

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const pos = gl.getAttribLocation(prog, 'a_pos')
      gl.enableVertexAttribArray(pos)
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

      uRes = gl.getUniformLocation(prog, 'u_res')
      uTime = gl.getUniformLocation(prog, 'u_time')
      uPointer = gl.getUniformLocation(prog, 'u_pointer')

      el.addEventListener('pointermove', (e) => {
        const b = el.getBoundingClientRect()
        pointer.tx = ((e.clientX - b.left) / b.width) * 2 - 1
        pointer.ty = 1 - ((e.clientY - b.top) / b.height) * 2
      })
      el.addEventListener('pointerleave', () => { pointer.tx = pointer.ty = 0 })
      return true
    },
    resize() {
      const c = canvas.value!
      gl!.viewport(0, 0, c.width, c.height)
      gl!.uniform2f(uRes, c.width, c.height)
    },
    frame(t) {
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      gl!.uniform1f(uTime, t / 1000)
      gl!.uniform2f(uPointer, pointer.x, pointer.y)
      for (const [name, v] of Object.entries(uniforms())) gl!.uniform1f(gl!.getUniformLocation(prog!, name), v)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    },
  }, 1.5)
}
