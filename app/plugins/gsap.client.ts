import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registered once, client-side: every component can then use `scrollTrigger` and `drawSVG` in its tweens.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)
  ScrollTrigger.config({ ignoreMobileResize: true }) // the mobile URL bar showing/hiding must not re-measure pins
})
