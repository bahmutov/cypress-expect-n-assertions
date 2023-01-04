/// <reference types="Cypress" />
const { plan } = require('../..')

describe('fails-4', () => {
  it('waits but there are not enough assertions', () => {
    plan(5)
    expect(true).to.be.true
    expect(true).to.be.true
    expect(true).to.be.true
  })
})
