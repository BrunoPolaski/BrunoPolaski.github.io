import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectLocale, isLocale } from './locale.ts'

test('detectLocale takes the first supported language, by primary subtag', () => {
  assert.equal(detectLocale('en-US,en;q=0.9,pt-BR;q=0.8'), 'en')
  assert.equal(detectLocale('pt-PT,pt;q=0.9'), 'pt-BR')
  assert.equal(detectLocale('de-DE,es;q=0.7'), 'es')
})

test('detectLocale falls back to pt-BR', () => {
  assert.equal(detectLocale('de-DE,fr;q=0.9'), 'pt-BR')
  assert.equal(detectLocale(''), 'pt-BR')
  assert.equal(detectLocale(), 'pt-BR')
})

test('isLocale rejects anything but the supported codes', () => {
  assert.equal(isLocale('en'), true)
  assert.equal(isLocale('pt-br'), false)
  assert.equal(isLocale(undefined), false)
})
