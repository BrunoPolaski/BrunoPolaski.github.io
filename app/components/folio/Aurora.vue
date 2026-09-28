<script setup lang="ts">
/**
 * The page background: a slow, domain-warped gradient in the brand's indigo and violet, lit at the
 * top and falling off to the page colour at the bottom, under a fixed film grain.
 * It's soft, so it renders at a quarter of the screen size and is scaled up 4x: 1/16 of the pixels,
 * and slow, so it redraws 30 times a second whatever the display's refresh rate.
 */
const props = defineProps<{ light: boolean }>()

const frag = /* glsl */ `
uniform vec2 u_res;
uniform float u_time;
uniform float u_light;
${GLSL_NOISE}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2(uv.x * u_res.x / u_res.y, uv.y);
  float t = u_time * 0.045;

  // domain warp: noise bending noise, so the colour flows instead of drifting
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.7 + 3.2 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.7 + 3.2 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.6 * r);

  vec3 base   = mix(vec3(0.039, 0.043, 0.055), vec3(0.957, 0.961, 0.969), u_light);
  vec3 deep   = mix(vec3(0.075, 0.06, 0.27),   vec3(0.80, 0.80, 0.98),    u_light);
  vec3 violet = mix(vec3(0.43, 0.42, 1.0),     vec3(0.60, 0.58, 1.0),     u_light);
  vec3 blue   = mix(vec3(0.08, 0.30, 0.70),    vec3(0.70, 0.84, 1.0),     u_light);

  vec3 col = mix(base, deep, smoothstep(0.2, 0.75, f));
  col = mix(col, violet, smoothstep(0.5, 0.9, f) * 0.55);
  col = mix(col, blue, smoothstep(0.4, 0.9, r.y) * 0.35);

  // lit from the top, falling off to the page colour toward the bottom
  col = mix(base, col, smoothstep(-0.1, 0.85, uv.y));
  gl_FragColor = vec4(col, 1.0);
}`

const canvas = ref<HTMLCanvasElement>()
useShader(canvas, frag, () => ({ u_light: props.light ? 1 : 0 }), 30) // it drifts slowly: 30 draws a second look the same as 144
</script>

<template>
  <div class="aurora" aria-hidden="true">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.aurora { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: var(--canvas); }
.aurora canvas { width: 25%; height: 25%; transform: scale(4); transform-origin: 0 0; }
/* film grain over the gradient, so it reads as light, not as a flat fill */
.aurora::after { content: ''; position: absolute; inset: 0; background: var(--acrylic-noise); opacity: 0.55; mix-blend-mode: overlay; }
</style>
