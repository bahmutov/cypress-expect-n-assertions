/// <reference types="Cypress" />
const {plan} = require('../..')

it('fails synchronously', () => {
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
  expect(false).to.be.true
})

it('fails wrong number of assertions', () => {
  plan(1)
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
})
