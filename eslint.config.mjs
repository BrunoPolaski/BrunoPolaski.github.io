import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // optional TS props are intentionally undefined
  rules: { 'vue/require-default-prop': 'off' },
})
