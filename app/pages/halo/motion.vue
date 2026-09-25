<template>
  <DocsPage title="Pixel & motion" lead="Canvas and WebGL effects that pause off screen and hold still when reduced motion is on. This is the only place Halo uses color.">
    <DocsDemo title="Particle sphere" usage='<FxPixelSphere :count="5200" :speed="1" /> (move the pointer over it)'>
      <div class="dark-stage"><FxPixelSphere /></div>
    </DocsDemo>
    <DocsDemo title="Horizon glow" usage="<FxHorizonGlow /> (WebGL; fills its positioned parent)">
      <div class="dark-stage"><FxHorizonGlow /></div>
    </DocsDemo>
    <DocsDemo title="Pixel grid" usage='<FxPixelGrid :cell="14" /> (move the pointer across it)'>
      <div class="stage"><FxPixelGrid /></div>
    </DocsDemo>
    <DocsDemo title="Pixel text" usage='<FxPixelText text="HALO" /> (click to replay)'>
      <div class="stage"><FxPixelText text="HALO" /></div>
    </DocsDemo>
    <DocsDemo title="Pixel loader" usage="<FxPixelLoader label=&quot;Loading invoices&quot; />">
      <FxPixelLoader label="Loading invoices" />
    </DocsDemo>
  </DocsPage>
</template>

<style scoped>
.stage, .dark-stage { position: relative; height: 280px; border-radius: 10px; overflow: hidden; }
.dark-stage { background: #000; }
</style>
