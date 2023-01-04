/// <reference types="Cypress" />
const {plan} = require('../..')

describe('second spec', () => {
  it('has 10 expects', () => {
    plan(10)
    for (let k = 0; k < 10; k += 1) {
      expect(k, `k = ${k}`).to.equal(k)
    }
  })
})
