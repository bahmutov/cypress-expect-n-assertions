/// <reference types="Cypress" />
const {plan} = require('../..')

it('has async assertion, will wait automatically', () => {
  plan(2)
  expect(1, 'one').to.equal(1)
  setTimeout(() => {
    expect(2, 'two').to.equal(2)
  }, 2000)
})

it('has async should retry - will wait because plans 1 assertion', () => {
  plan(1)

  let x
  setTimeout(() => {
    x = true
  }, 1000)

  cy.wrap(null).should(() => {
    expect(x, 'x was set').to.be.true
  })
})
