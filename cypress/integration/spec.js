// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />
const {plan} = require('../..')

it('has 2 expects', () => {
  plan(2)
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
})

it('has 1 should', () => {
  plan(1)
  cy.wrap(3).should('equal', 3)
})

it('has 1 should cb', () => {
  plan(1)
  cy.wrap(3).should(x => expect(x).to.equal(3))
})

it('has 1 should and 1 and', () => {
  plan(2)
  cy.wrap(3).should('equal', 3).and('be.gt', 2)
})

it('has 2 expects and a wrapped should', () => {
  plan(3)
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
  cy.wrap(3).should('equal', 3)
})

it('has async assertion', () => {
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

// example failing test
it.skip('fails', () => {
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
  expect(false).to.be.true
})

// returning a promise is working - Cypress will wait for it
// afterEach(function () {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('3 seconds done')
//       resolve()
//     }, 3000)
//   })
// })

// done() is not working - Cypress is not waiting for it
// afterEach(function (done) {
//   setTimeout(() => {
//     console.log('3 seconds done')
//     done()
//   }, 3000)
// })
