/// <reference types="Cypress" />
const { plan } = require('../..')

describe('fails-3', () => {
  it('fails by waiting for an assertion', () => {
    setTimeout(() => {
      expect(false).to.be.true
    }, 1000)

    plan(1)
  })
})
