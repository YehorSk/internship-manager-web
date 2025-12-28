describe('Company Activation', () => {

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('401') ||
        err.message.includes('ResizeObserver') ||
        err.message.includes('Network Error') ||
        err.message.includes('ERR_CONNECTION_REFUSED') ||
        err.message.includes('Request failed with status code 401') ||
        err.message.includes('Cannot read properties')) {
      return false
    }
  })

  beforeEach(() => {
    cy.viewport(1280, 800)
  })

  it('TC01: Navigate to company activation page', () => {
    cy.visit('/company-activation')
    cy.wait(10000)
    cy.url({ timeout: 60000 }).should('include', '/company-activation')
    cy.get('body', { timeout: 60000 }).should('be.visible')
  })

  it('TC02: Activation page title and description are visible', () => {
    cy.visit('/company-activation')
    cy.wait(10000)
    cy.contains('Aktivácia spoločnosti', { timeout: 60000 }).should('be.visible')
    cy.get('.v-card-text', { timeout: 60000 }).should('be.visible')
  })

  it('TC03: Missing token message is displayed when no token provided', () => {
    cy.visit('/company-activation')
    cy.wait(10000)
    cy.contains('Chýba aktivačný token', { timeout: 60000 }).should('exist')
  })

  it('TC04: Activate button is disabled when no token provided', () => {
    cy.visit('/company-activation')
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('be.disabled')
  })

  it('TC05: Login button is visible and navigates to login page', () => {
    cy.visit('/company-activation')
    cy.wait(10000)
    cy.contains('Prihlásiť sa', { timeout: 60000 }).should('be.visible')
    cy.get('.login-btn', { timeout: 60000 }).should('be.visible').click()
    cy.wait(5000)
    cy.url({ timeout: 60000 }).should('include', '/login')
  })

  it('TC06: Activate button is enabled when token is provided', () => {
    const testToken = 'test-activation-token-123'
    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled')
    cy.contains('Chýba aktivačný token', { timeout: 60000 }).should('not.exist')
  })

  it('TC07: Activate company successfully with valid token', () => {
    const testToken = 'test-activation-token-123'
    cy.intercept('GET', `/api/company/activate/${testToken}`, {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne aktivovaná.'
      }
    }).as('activateCompany')

    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled').click()
    cy.wait('@activateCompany', { timeout: 60000 })
    cy.wait(2000)
    cy.get('body', { timeout: 60000 }).should('contain', 'úspešne')
  })

  it('TC08: Handle error when activation fails', () => {
    const testToken = 'invalid-token'
    cy.intercept('GET', `/api/company/activate/${testToken}`, {
      statusCode: 400,
      body: {
        success: false,
        message: 'Neplatný aktivačný token.'
      }
    }).as('activateCompanyFail')

    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled').click()
    cy.wait('@activateCompanyFail', { timeout: 60000 })
    cy.wait(2000)
    cy.get('body', { timeout: 60000 }).should(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((txt) => txt.includes('chyba') || txt.includes('Neplatný'))
    })
  })

  it('TC09: Activate button shows loading state during activation', () => {
    const testToken = 'test-activation-token-123'
    cy.intercept('GET', `/api/company/activate/${testToken}`, {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne aktivovaná.'
      },
      delay: 2000
    }).as('activateCompanySlow')

    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled').click()
    cy.contains('Aktivujem…', { timeout: 60000 }).should('exist')
    cy.wait('@activateCompanySlow', { timeout: 60000 })
  })

  it('TC10: Activate button is disabled after successful activation', () => {
    const testToken = 'test-activation-token-123'
    cy.intercept('GET', `/api/company/activate/${testToken}`, {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne aktivovaná.'
      }
    }).as('activateCompany')

    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled').click()
    cy.wait('@activateCompany', { timeout: 60000 })
    cy.wait(3000)
    cy.get('.activate-btn', { timeout: 60000 }).should('be.disabled')
  })

  it('TC11: Page displays correct content with token in URL', () => {
    const testToken = 'test-activation-token-123'
    cy.visit(`/company-activation?token=${testToken}`)
    cy.wait(10000)
    cy.contains('Aktivácia spoločnosti', { timeout: 60000 }).should('be.visible')
    cy.contains('Chýba aktivačný token', { timeout: 60000 }).should('not.exist')
    cy.get('.activate-btn', { timeout: 60000 }).should('not.be.disabled')
    cy.contains('Aktivovať', { timeout: 60000 }).should('be.visible')
  })

})
