describe('Student Login – Complete QA Test Suite', () => {

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('Request failed with status code 401')) {
      return false
    }
  })

  const VALID_EMAIL = 'john.student@example.com'
  const VALID_PASSWORD = 'password123'

  beforeEach(() => {
    cy.visit('/login')
  })

  it('TC01: Student successfully logs in and is redirected to dashboard', () => {
    cy.get('input[type="email"]').type(VALID_EMAIL)
    cy.get('input[type="password"]').type(VALID_PASSWORD)

    cy.get('.login-btn').should('not.be.disabled').click()

    cy.wait(1500)

    cy.url().should('include', '/student-dashboard')
    cy.contains('Rozhranie študenta').should('be.visible')
  })

  it('TC02: Cannot submit with empty email and password', () => {
    cy.get('.login-btn').should('be.disabled')
  })

  it('TC03: Empty email shows validation error', () => {
    cy.get('input[type="password"]').type('something')

    cy.get('input[type="email"]').type('a').clear().blur()

    cy.contains('Povinné pole').should('exist')

    cy.get('.login-btn').should('be.disabled')
  })

  it('TC04: Empty password shows validation error', () => {
    cy.get('input[type="email"]').type('test@example.com')

    cy.get('input[type="password"]').type('x').clear().blur()

    cy.contains('Povinné pole').should('exist')

    cy.get('.login-btn').should('be.disabled')
  })

  const invalidEmails = [
    'invalid',
    'test@',
    'test@domain',
    '@domain.com',
    'test@domain..com'
  ]

  invalidEmails.forEach((email) => {
    it(`TC05: Invalid email "${email}" disables login button`, () => {
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="email"]').blur()

      cy.contains('Neplatný e-mail').should('exist')
      cy.get('.login-btn').should('be.disabled')
    })
  })

  it('TC06: Wrong password shows error', () => {
    cy.get('input[type="email"]').type('john.student@example.com')
    cy.get('input[type="password"]').type('wrongpassword')

    cy.get('.login-btn').click()

    cy.contains('Neplatné prihlasovacie údaje.', { timeout: 5000 })
      .should('exist')
  })

  it('TC07: Non-existing user shows error', () => {
    cy.get('input[type="email"]').type('idontexist@example.com')
    cy.get('input[type="password"]').type('password123')

    cy.get('.login-btn').click()

    cy.contains('Neplatné prihlasovacie údaje.', { timeout: 5000 })
      .should('exist')
  })

  it('TC08: User without STUDENT role cannot access student dashboard', () => {
    cy.get('input[type="email"]').type('norole@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('.login-btn').click()

    cy.wait(800)

    cy.url().should('include', '/login')
  })

  it('TC09: Password input is type="password"', () => {
    cy.get('input[type="password"]').should('have.attr', 'type', 'password')
  })

  it('TC10: Login button becomes enabled only when form is valid', () => {
    cy.get('.login-btn').should('be.disabled')

    cy.get('input[type="email"]').type(VALID_EMAIL)
    cy.get('input[type="password"]').type(VALID_PASSWORD)

    cy.get('.login-btn').should('not.be.disabled')
  })

})
