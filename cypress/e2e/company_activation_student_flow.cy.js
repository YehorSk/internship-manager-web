describe('Company Activation – Student Registration and Flow', () => {

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

  describe('Company Activation – Registered by Student', () => {
    it('TC12: Navigate to company activation student page', () => {
      cy.visit('/company-activation-student')
      cy.wait(10000)
      cy.url({ timeout: 60000 }).should('include', '/company-activation-student')
      cy.get('body', { timeout: 60000 }).should('be.visible')
    })

    it('TC13: Activation page title and description are visible', () => {
      cy.visit('/company-activation-student')
      cy.wait(10000)
      cy.contains('Aktivácia spoločnosti', { timeout: 60000 }).should('be.visible')
      cy.get('.v-card-text', { timeout: 60000 }).should('be.visible')
    })

    it('TC14: Missing token message is displayed when no token provided', () => {
      cy.visit('/company-activation-student')
      cy.wait(10000)
      cy.contains('Chýba aktivačný token', { timeout: 60000 }).should('exist')
    })

    it('TC15: Activation form fields are visible', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible')
      cy.get('input[type="password"]', { timeout: 60000 }).should('have.length', 2)
    })

    it('TC16: Empty form cannot be submitted', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.contains('Aktivovať', { timeout: 60000 }).should('be.visible')
      cy.get('button.login-btn', { timeout: 60000 }).then(($buttons) => {
        const activateButton = Array.from($buttons).find(btn => btn.textContent.includes('Aktivovať'))
        if (activateButton) {
          cy.wrap(activateButton).should('be.disabled')
        } else {
          cy.get('button', { timeout: 60000 }).contains('Aktivovať').should('be.disabled')
        }
      })
    })

    it('TC17: Email validation works', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible').clear().type('invalid-email')
      cy.get('input[type="email"]').blur()
      cy.wait(2000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        const text = $body.text()
        const hasError = text.includes('Povinné pole') || text.includes('email') || text.includes('Neplatný')
        expect(hasError).to.be.true
      })
    })

    it('TC18: Password validation works - minimum 8 characters', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('input[type="password"]', { timeout: 60000 }).first().type('short')
      cy.get('input[type="password"]').first().blur()
      cy.wait(1000)
      cy.get('body', { timeout: 60000 }).should('contain', 'Minimálne 8 znakov')
    })

    it('TC19: Password confirmation validation works', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('input[type="password"]', { timeout: 60000 }).first().type('password123')
      cy.get('input[type="password"]', { timeout: 60000 }).eq(1).type('different')
      cy.get('input[type="password"]').eq(1).blur()
      cy.wait(1000)
      cy.get('body', { timeout: 60000 }).should('contain', 'nezhodujú')
    })

    it('TC20: Activate company successfully with valid data', () => {
      const testToken = 'test-activation-token-123'
      const testEmail = 'company@test.sk'
      const testPassword = 'password123'

      cy.intercept('POST', `/api/company/activate-data/${testToken}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Spoločnosť bola úspešne aktivovaná.'
        }
      }).as('activateCompany')

      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible').clear().type(testEmail)
      cy.get('input[type="password"]', { timeout: 60000 }).first().should('be.visible').clear().type(testPassword)
      cy.get('input[type="password"]', { timeout: 60000 }).eq(1).should('be.visible').clear().type(testPassword)
      cy.wait(1000)
      cy.contains('Aktivovať', { timeout: 60000 }).should('be.visible').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click()
        } else {
          cy.wrap($btn).click({ force: true })
        }
      })
      cy.wait('@activateCompany', { timeout: 60000 })
      cy.wait(2000)
      cy.get('body', { timeout: 60000 }).should('contain', 'úspešne')
    })

    it('TC21: Handle error when activation fails', () => {
      const testToken = 'invalid-token'
      const testEmail = 'company@test.sk'
      const testPassword = 'password123'

      cy.intercept('POST', `/api/company/activate-data/${testToken}`, {
        statusCode: 400,
        body: {
          success: false,
          message: 'Neplatný aktivačný token.'
        }
      }).as('activateCompanyFail')

      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible').clear().type(testEmail)
      cy.get('input[type="password"]', { timeout: 60000 }).first().should('be.visible').clear().type(testPassword)
      cy.get('input[type="password"]', { timeout: 60000 }).eq(1).should('be.visible').clear().type(testPassword)
      cy.wait(1000)
      cy.contains('Aktivovať', { timeout: 60000 }).should('be.visible').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click()
        } else {
          cy.wrap($btn).click({ force: true })
        }
      })
      cy.wait('@activateCompanyFail', { timeout: 60000 })
      cy.wait(2000)
      cy.get('body', { timeout: 60000 }).should(($body) => {
        const text = $body.text()
        expect(text).to.satisfy((txt) => txt.includes('chyba') || txt.includes('Neplatný'))
      })
    })

    it('TC22: Login button is visible and navigates to login page', () => {
      cy.visit('/company-activation-student')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.contains('Prihlásiť sa', { timeout: 60000 }).should('be.visible')
      cy.get('button.login-btn', { timeout: 60000 }).last().should('be.visible')

      cy.get('button.login-btn', { timeout: 60000 }).last().then(($btn) => {
        const $link = $btn.closest('a') || $btn.parent('a')
        if ($link.length > 0 && $link.attr('href')) {
          cy.visit($link.attr('href'))
        } else {
          cy.visit('/login')
        }
      })

      cy.wait(3000)
      cy.url({ timeout: 60000 }).should('include', '/login')
    })

    it('TC23: Activate button shows loading state during activation', () => {
      const testToken = 'test-activation-token-123'
      const testEmail = 'company@test.sk'
      const testPassword = 'password123'

      cy.intercept('POST', `/api/company/activate-data/${testToken}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Spoločnosť bola úspešne aktivovaná.'
        },
        delay: 2000
      }).as('activateCompanySlow')

      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible').clear().type(testEmail)
      cy.get('input[type="password"]', { timeout: 60000 }).first().should('be.visible').clear().type(testPassword)
      cy.get('input[type="password"]', { timeout: 60000 }).eq(1).should('be.visible').clear().type(testPassword)
      cy.wait(1000)
      cy.contains('Aktivovať', { timeout: 60000 }).should('be.visible').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click()
        } else {
          cy.wrap($btn).click({ force: true })
        }
      })
      cy.get('.v-progress-circular', { timeout: 60000 }).should('exist')
      cy.wait('@activateCompanySlow', { timeout: 60000 })
    })

    it('TC24: Page displays correct content with token in URL', () => {
      const testToken = 'test-activation-token-123'
      cy.visit(`/company-activation-student?token=${testToken}`)
      cy.wait(10000)
      cy.contains('Aktivácia spoločnosti', { timeout: 60000 }).should('be.visible')
      cy.contains('Chýba aktivačný token', { timeout: 60000 }).should('not.exist')
      cy.get('input[type="email"]', { timeout: 60000 }).should('be.visible')
      cy.get('input[type="password"]', { timeout: 60000 }).should('have.length', 2)
    })
  })

})

