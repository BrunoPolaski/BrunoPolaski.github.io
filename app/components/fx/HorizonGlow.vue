<script setup lang="ts">
/** `level`: rim height at its lowest point, as a fraction of the canvas height. */
const props = withDefaults(defineProps<{ level?: number }>(), { level: 0.26 })

// Light pooling behind the lower edge of a huge dark lens: a concave rim with
// chromatic dispersion, and coloured lights drifting along it.
const frag = /* glsl */ `
uniform vec2 u_res;
uniform float u_time;
uniform float u_level;
${GLSL_NOISE}

vec3 spectrum(float h) { return 0.5 + 0.5 * cos(6.2832 * (h + vec3(0.0, 0.33, 0.67))); }

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res.y;
  float t = u_time;

  // big circle whose bottom arc is the rim; inside = the lit region above it
  float R = max(aspect, 1.4) * 1.1; // floor keeps the curve gentle on tall, narrow canvases
  vec2 C = vec2(aspect * 0.5, u_level + R);
  float sd = length(uv - C) - R;
  float above = smoothstep(0.004, -0.004, sd);

  // coloured lights drifting along the rim; "lights" is their colour at this x
  vec3 hues[4];
  hues[0] = vec3(1.0, 0.1, 0.3);
  hues[1] = vec3(0.3, 1.0, 0.45);
  hues[2] = vec3(0.3, 0.35, 1.0);
  hues[3] = vec3(1.0, 0.5, 0.15);
  vec3 lights = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float x = aspect * (0.5 + 0.5 * sin(t * (0.06 + 0.02 * fi) + fi * 1.9));
    float w = 0.05 + 0.035 * fi;
    float dx = uv.x - x;
    lights += hues[i] * exp(-dx * dx / w);
  }

  float inner = min(sd, 0.0); // 0 on the rim, negative going up into the light
  float smoke = 0.6 + 0.8 * fbm(vec2(uv.x * 2.0 + t * 0.04, inner * 6.0 - t * 0.02));
  vec3 col = lights * exp(inner * 7.5) * above * 1.9 * smoke;

  // thin-film bands layered just inside the rim
  vec3 film = spectrum(inner * 16.0 + uv.x * 0.25 + t * 0.02);
  col += film * lights * exp(inner * 18.0) * above * 0.35;

  // the rim: a hairline split into R, G, B at slightly different radii
  float disp = 0.003;
  vec3 rimLine = vec3(
    exp(-abs(sd + disp) * 380.0),
    exp(-abs(sd) * 380.0),
    exp(-abs(sd - disp) * 380.0));
  vec3 rimTint = spectrum(uv.x * 0.35 - t * 0.03);
  col += rimLine * (0.25 + 0.35 * rimTint + 1.2 * lights);
  col += (lights + 0.2 * rimTint) * exp(-abs(sd) * 60.0) * 0.3;
  // faint reflection just below the rim
  col += lights * exp(-max(sd, 0.0) * 80.0) * (1.0 - above) * 0.08;

  col = 1.0 - exp(-col * 1.4); // tonemap: bright but never clipped
  col += (hash(gl_FragCoord.xy + fract(t) * 61.0) - 0.5) * 0.03;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`

const canvas = ref<HTMLCanvasElement>()
useShader(canvas, frag, () => ({ u_level: props.level }))
</script>

<template>
  <canvas ref="canvas" class="horizon" aria-hidden="true" />
</template>

<style scoped>
.horizon { position: absolute; inset: 0; width: 100%; height: 100%; background: #000; pointer-events: none; }
</style>
