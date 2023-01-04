/// <reference types="Cypress" />

module.exports = {
  plan(n) {
    // TODO check if the number was set already
    cy.state('expectAssertions', n)
  },
}

const shouldOverwrite = (_should, ...args) => {
  // console.log(...args)
  if (!Cypress._.isFunction(args[1])) {
    // debugger
    incrementAssertions()
    return _should(...args)
  }

  const n = getActualAssertions()
  return _should(...args).tapCatch(() => {
    // restore assertion count to prevent retries
    // from incrementing the counter A LOT
    setActualAssertions(n)
  })
}

Cypress.Commands.overwrite('should', shouldOverwrite)

Cypress.Commands.overwrite('and', shouldOverwrite)

const getActualAssertions = () => {
  return cy.state('actualAssertions') || 0
}

const setActualAssertions = (n) => {
  cy.state('actualAssertions', n)
}

const incrementAssertions = () => {
  const actual = getActualAssertions()
  setActualAssertions(actual + 1)
}

// overwrite the global "expect" function
const _expect = expect

expect = (val, message) => {
  // console.log('retries', cy.state('runnable'))
  incrementAssertions()
  return _expect(val, message)
}

afterEach(function () {
  if (this.currentTest.state === 'passed') {
    // look at expected and actual number of assertions
    let assertions = getActualAssertions()

    const expectAssertions = cy.state('expectAssertions')
    // console.log('%d assertions %d expected', assertions, expectAssertions)
    if (
      Cypress._.isFinite(expectAssertions) &&
      assertions !== expectAssertions
    ) {
      if (assertions < expectAssertions) {
        // wait until the number of assertions becomes the expected number
        cy.wrap(null, { log: false }).should(() => {
          assertions = getActualAssertions()
          expect(assertions, 'assertions vs planned').to.equal(expectAssertions)
        })
      } else {
        expect(assertions, 'assertions vs planned').to.equal(expectAssertions)
      }
    }
  }
})
