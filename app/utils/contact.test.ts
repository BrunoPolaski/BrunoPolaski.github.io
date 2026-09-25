import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fill, whatsappUrl } from './contact.ts'

test('fill replaces known placeholders and keeps unknown ones', () => {
  assert.equal(fill('Hi, I am {name}.\n\n{message}', { name: 'Ana', message: 'A {task}' }), 'Hi, I am Ana.\n\nA {task}')
  assert.equal(fill('{missing}', {}), '{missing}')
})

test('whatsappUrl keeps only digits and encodes the text', () => {
  assert.equal(whatsappUrl('+55 (41) 99999-0000', 'Olá & até já?'), 'https://wa.me/5541999990000?text=Ol%C3%A1%20%26%20at%C3%A9%20j%C3%A1%3F')
  assert.equal(whatsappUrl(5541999990000, 'Hi'), 'https://wa.me/5541999990000?text=Hi') // env parsed as a number
})
