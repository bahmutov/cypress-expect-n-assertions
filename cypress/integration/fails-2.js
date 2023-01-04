/// <reference types="Cypress" />
const { plan } = require('../..')

describe('fails-2', () => {
  it('fails if there are no assertions', () => {
    plan(1)
    cy.log('no assertions')
  })
})
