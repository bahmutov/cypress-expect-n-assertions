/// <reference types="Cypress" />

module.exports = {
  plan (n) {
    // TODO check if the number was set already
    cy.state('expectAssertions', n)
  }
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

const _expect = expect
expect = (val, message) => {
  // console.log('retries', cy.state('runnable'))
  incrementAssertions()
  return _expect(val, message)
}

afterEach(function () {
  console.log('in afterEach', this.currentTest)
  if (this.currentTest.state === 'passed') {
    // look at expected and actual number of assertions
    // hmm, there is no commands in non-interactive mode
    // const commands = this.currentTest.commands
    // let assertions = Cypress._.filter(commands, {name: 'assert'})
    let assertions = getActualAssertions()
    console.log('%d assertions', assertions)
    // console.table(assertions)

    const expectAssertions = cy.state('expectAssertions')
    if (Cypress._.isFinite(expectAssertions) && assertions !== expectAssertions) {
      if (assertions < expectAssertions) {
        // wait - maybe another assertion will happen!
        return new Promise((resolve) => {
          let interval
          const maxWait = Cypress.config().defaultCommandTimeout
          const startedAt = Number(new Date())
          const checkNumber = () => {
            assertions = getActualAssertions()

            if (assertions === expectAssertions) {
              console.log('all good')
              clearInterval(interval)
              return resolve()
            }
            const elapsed = new Date() - startedAt
            if (elapsed > maxWait) {
              clearInterval(interval)
              expect(assertions, 'assertions vs planned').to.equal(expectAssertions)
              return resolve()
            }
          }
          interval = setInterval(checkNumber, 10)
        })
      } else {
        expect(assertions, 'assertions vs planned').to.equal(expectAssertions)
      }
    }
  }
})
