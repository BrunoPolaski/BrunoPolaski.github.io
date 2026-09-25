<script setup lang="ts">
/**
 * A vortex of particles that closes in on itself and leaves a glow behind.
 * On load, a wide cloud gathers, spins faster as it collapses, and fades into a soft
 * violet light that stays, slowly breathing, behind the hero. A few particles fling
 * back out of the collapse and stay, orbiting the name.
 */
const frag = /* glsl */ `
uniform vec2 u_res;
uniform float u_time;
uniform float u_grow;  // 0..1, how much of the cloud has gathered
uniform float u_cloud; // cloud size, relative to R (collapses toward 0)
uniform float u_spin;  // extra turn the vortex has wound up while collapsing
uniform float u_clear; // 0..1, how much of the cloud has dissolved into the glow
uniform float u_glow;  // 0..1, how bright the glow left behind is
uniform float u_orbit; // 0..1, the survivors flinging out to their orbit
uniform float u_rx;    // orbit half-width, scene units: narrower when the screen is

float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1) * 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise3(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x), mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x), mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

const float R = 0.62;     // reference radius: the glow's reach
const float ZOOM = 1.35;  // scene units from the canvas centre to its edge
const vec3 VIOLET = vec3(0.48, 0.48, 1.0);

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * 2.0; // -1..1 across the canvas
  vec2 pc = uv * ZOOM;
  float rc = length(pc);
  float edge = smoothstep(0.98, 0.75, length(uv)); // fades everything out before the canvas edge
  float pixP = 2.0 * ZOOM / u_res.y; // one device pixel, in scene units

  // the glow: a soft core in a wide halo, stirred by slow mist, breathing
  float mist = 0.8 + 0.2 * noise3(vec3(pc * 2.0, u_time * 0.15));
  float breath = 1.0 + 0.06 * sin(u_time * 0.8);
  float light = (0.55 * exp(-pow(rc / (0.38 * breath), 2.0)) + 0.3 * exp(-rc / (0.5 * breath))) * mist * u_glow * edge;
  vec3 col = VIOLET * light;
  float alpha = min(light, 1.0);

  // the survivors: a few particles on a wide ellipse round the name, drifting counterclockwise
  if (u_orbit > 0.0) {
    float orbit = 0.0;
    for (int i = 0; i < 14; i++) {
      float fi = float(i);
      vec2 h = hash22(vec2(fi, 3.7));
      float a = fi / 14.0 * 6.2832 + h.x * 0.4 + u_time * (0.12 + 0.06 * h.y);
      float reach = mix(0.3, 1.0, u_orbit) * (1.0 + 0.03 * sin(u_time * 1.3 + fi));
      vec2 at = vec2(cos(a) * u_rx * (0.92 + 0.08 * h.y), sin(a) * (0.6 + 0.06 * h.x)) * reach;
      float d = length(pc - at) / pixP; // device pixels
      float size = 1.2 + 1.2 * h.x;
      float twinkle = 0.6 + 0.4 * sin(u_time * 2.0 + fi * 1.7);
      orbit += (smoothstep(size + 0.8, size - 0.4, d) + 0.25 * exp(-d / (4.0 + 4.0 * h.y))) * twinkle;
    }
    orbit *= u_orbit; // no edge fade: the widest orbit (1.1 * 1.03) stays inside the canvas
    col += mix(VIOLET, vec3(1.0), 0.6) * orbit;
    alpha += min(orbit, 1.0) * (1.0 - alpha);
  }

  // the vortex: a round, ragged cloud of particles, bright at its rim, spinning faster as it collapses
  float fade = 1.0 - u_clear;
  if (fade > 0.0) {
    vec2 dir = pc / max(rc, 1e-4);
    float ragged = (noise3(vec3(dir * 2.5, u_time * 1.2)) - 0.5) * 0.3;
    float d = rc / (R * 1.1 * u_cloud) + ragged;
    float body = smoothstep(1.1, 0.45, d);
    float ring = exp(-pow((d - 0.85) / 0.13, 2.0)); // the bright shell of the cloud
    float fog = 0.4 + 0.6 * noise3(vec3(pc * 3.5, u_time * 0.8)); // swirling mist
    float density = clamp(body * 0.45 + ring * 0.9, 0.0, 1.0) * fog * u_grow;

    // particles: one per cell of a grid that swirls round the centre (inner ones faster),
    // each on its own quick little orbit; each has its own density threshold, so they join one by one
    const float CELL = 0.014;
    float swirl = u_time * (0.4 + 0.5 / (0.4 + rc)) + u_spin / (0.3 + rc);
    vec2 q = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * pc / CELL;
    vec2 ci = floor(q);
    float speck = 0.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 id = ci + vec2(i, j);
        vec2 h = hash22(id), k = hash22(id + 71.3), c = hash22(id - 13.7);
        vec2 at = id + 0.2 + 0.6 * h + 0.3 * vec2(sin(u_time * (5.0 + 7.0 * k.x) + 6.28 * h.y), cos(u_time * (5.0 + 7.0 * k.y) + 6.28 * h.x));
        float dot_ = smoothstep(2.0, 0.6, length(q - at) * CELL / pixP);
        float gate = 0.1 + 0.9 * c.x; // floored, so no particle shows where the cloud isn't
        float on = smoothstep(gate - 0.08, gate + 0.08, density);
        speck += dot_ * on * (0.6 + 0.4 * sin(u_time * 4.0 + 6.28 * c.y)); // a slow twinkle
      }
    }

    float cloud = (density * 0.22 + speck * (0.8 + 1.2 * ring)) * fade * edge; // mist under the specks
    vec3 tint = mix(VIOLET, vec3(0.92, 0.9, 1.0), ring * 0.5);
    col += tint * cloud;
    alpha += min(cloud, 1.0) * (1.0 - alpha);
  }

  col = 1.0 - exp(-col * 1.5); // tonemap
  gl_FragColor = vec4(col, alpha); // premultiplied
}`

// Intro timeline, in seconds from mount; reduced motion starts at the end.
let born = 0
onMounted(() => {
  born = matchMedia('(prefers-reduced-motion: reduce)').matches ? -1e6 : performance.now()
})
const ease = (k: number) => k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2 // in-out cubic
/** 0..1 progress through [from, from + dur] seconds, eased. */
const span = (t: number, from: number, dur: number) => ease(Math.min(Math.max((t - from) / dur, 0), 1))
const END = 1.9 // s: the moment the vortex has collapsed
function intro() {
  const t = (performance.now() - born) / 1000
  const close = Math.min(Math.max((t - 0.5) / (END - 0.5), 0), 1) ** 2 // accelerates inward
  const flare = span(t, END - 0.3, 0.3) * Math.exp(-Math.max(t - END, 0) * 2.5) // brightest as it converges
  return {
    u_grow: span(t, 0, 1.0), // particles gather into a wide cloud
    u_cloud: 1.75 - 1.6 * close, // that collapses toward the centre
    u_spin: 3 * close, // winding up as it goes
    u_clear: span(t, END - 0.2, 0.5), // and dissolves
    u_glow: span(t, END - 0.5, 0.9) + 0.5 * flare, // into the glow it leaves behind
    u_orbit: span(t, END - 0.3, 1.2), // while a few fling back out and stay
    u_rx: orbitWidth,
  }
}

const canvas = ref<HTMLCanvasElement>()
// the orbit clears the name: at most 1.1 scene units wide, less where the screen is narrower than the canvas
let orbitWidth = 1.1
function fitOrbit() {
  const w = canvas.value?.clientWidth
  if (w) orbitWidth = Math.min(1.1, innerWidth / w * 1.35 * 0.8) // 1.35 = ZOOM
}
onMounted(() => {
  fitOrbit()
  addEventListener('resize', fitOrbit, { passive: true })
})
onBeforeUnmount(() => removeEventListener('resize', fitOrbit))
useShader(canvas, frag, intro)
</script>

<template>
  <canvas ref="canvas" class="orb" aria-hidden="true" />
</template>

<style scoped>
.orb { display: block; pointer-events: none; }
</style>
