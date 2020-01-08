// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

Cypress.Commands.add('plan', function (n) {
  // TODO check if the number was set already
  cy.state('expectAssertions', n)
})

it('has 2 expects', () => {
  cy.plan(2)
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
})

it('has 2 expects and a wrapped should', () => {
  cy.plan(3)
  expect(1, 'one').to.equal(1)
  expect(2, 'two').to.equal(2)
  cy.wrap(3).should('equal', 3)
})

it('has async assertion', () => {
  cy.plan(2)
  expect(1, 'one').to.equal(1)
  setTimeout(() => {
    expect(2, 'two').to.equal(2)
  }, 2000)
})

it('has async should retry', () => {
  cy.plan(1)

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

afterEach(function () {
  console.log('in afterEach', this.currentTest)
  if (this.currentTest.state === 'passed') {
    // look at expected and actual number of assertions
    const commands = this.currentTest.commands
    let assertions = Cypress._.filter(commands, {name: 'assert'})
    console.log('%d assertions', assertions.length)
    console.table(assertions)

    const expectAssertions = cy.state('expectAssertions')
    if (Cypress._.isFinite(expectAssertions) && assertions.length !== expectAssertions) {
      if (assertions.length < expectAssertions) {
        // wait - maybe another assertion will happen!
        return new Promise((resolve) => {
          let interval
          const maxWait = Cypress.config().defaultCommandTimeout
          const startedAt = Number(new Date())
          const checkNumber = () => {
            assertions = Cypress._.filter(commands, {name: 'assert'})

            if (assertions.length === expectAssertions) {
              console.log('all good')
              clearInterval(interval)
              return resolve()
            }
            const elapsed = new Date() - startedAt
            if (elapsed > maxWait) {
              clearInterval(interval)
              expect(assertions.length, 'planned assertions timed out').to.equal(expectAssertions)
              return resolve()
            }
          }
          interval = setInterval(checkNumber, 10)
        })
      } else {
        expect(assertions.length, 'planned assertions').to.equal(expectAssertions)
      }
    }
  }
})
