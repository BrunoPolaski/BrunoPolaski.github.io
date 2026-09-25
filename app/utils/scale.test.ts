import { test } from 'node:test'
import assert from 'node:assert/strict'
import { compact, linear, niceTicks } from './scale.ts'

test('linear maps domain to range, including inverted ranges', () => {
  assert.equal(linear(0, 10, 0, 100)(5), 50)
  assert.equal(linear(0, 10, 200, 0)(10), 0)
  assert.equal(linear(3, 3, 0, 10)(3), 0)
})

test('niceTicks covers max with clean steps', () => {
  assert.deepEqual(niceTicks(87), [0, 25, 50, 75, 100])
  assert.deepEqual(niceTicks(4200), [0, 2000, 4000, 6000])
  assert.deepEqual(niceTicks(0.9), [0, 0.25, 0.5, 0.75, 1])
  assert.deepEqual(niceTicks(0), [0])
})

test('compact formats large numbers', () => {
  assert.equal(compact(12900), '12.9K')
  assert.equal(compact(4_200_000), '4.2M')
})
