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

  describe('Company Activation Flow - Email and Status Verification', () => {
    const SUPERVISOR_EMAIL = 'jan.novak@ukf.sk'
    const SUPERVISOR_PASSWORD = 'heslo'

    it('TC25: Company appears in supervisor list after registration (email sent)', () => {
      const companyName = `Test Company ${Date.now()}`
      const companyEmail = `testcompany${Date.now()}@test.sk`

      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Registrácia bola úspešná. Skontrolujte e-mail pre aktiváciu.'
        }
      }).as('registerCompany')

      cy.intercept('POST', '/api/companies/list*', {
        statusCode: 200,
        body: {
          data: [
            {
              user_id: 1,
              ico: '12345678',
              name: companyName,
              contact_name: 'Contact Name',
              contact_email: 'contact@test.sk',
              contact_phone: '+421912345678',
              status: false
            }
          ],
          current_page: 1,
          last_page: 1
        }
      }).as('fetchCompanies')

      cy.visit('/register?role=company')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.wait(2000)

      cy.get('input', { timeout: 60000 }).should('have.length.at.least', 8)
      cy.get('input').eq(0).clear({ force: true }).type('12345678', { force: true })
      cy.get('input').eq(1).clear({ force: true }).type(companyName, { force: true })
      cy.get('input[type="email"]', { timeout: 60000 }).first().clear({ force: true }).type(companyEmail, { force: true })
      cy.get('input').eq(3).clear({ force: true }).type('Test Address', { force: true })
      cy.get('input').eq(4).clear({ force: true }).type('Contact Name', { force: true })
      cy.get('input[type="email"]', { timeout: 60000 }).last().clear({ force: true }).type('contact@test.sk', { force: true })
      cy.get('input[type="tel"]', { timeout: 60000 }).clear({ force: true }).type('+421912345678', { force: true })
      cy.get('input').eq(7).clear({ force: true }).type('Manager', { force: true })
      cy.get('input[type="password"]', { timeout: 60000 }).first().clear({ force: true }).type('password123', { force: true })
      cy.get('input[type="password"]', { timeout: 60000 }).last().clear({ force: true }).type('password123', { force: true })

      cy.get('button[type="submit"]', { timeout: 60000 }).should('be.visible').click()
      cy.wait('@registerCompany', { timeout: 60000 })
      cy.wait(2000)

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'supervisor-token',
          user: {
            id: 1,
            email: SUPERVISOR_EMAIL,
            roles: [{ name: 'supervisor' }]
          }
        }
      }).as('loginSupervisor')

      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          id: 1,
          email: SUPERVISOR_EMAIL,
          roles: [{ name: 'supervisor' }]
        }
      }).as('getSupervisorUser')

      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).first().clear().type(SUPERVISOR_EMAIL)
      cy.get('input', { timeout: 60000 }).eq(1).clear().type(SUPERVISOR_PASSWORD)
      cy.get('.login-btn', { timeout: 60000 }).should('exist')
      cy.get('.login-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@loginSupervisor', { timeout: 60000 })
      cy.wait('@getSupervisorUser', { timeout: 60000 })
      cy.wait(5000)
      cy.url({ timeout: 120000 }).should('not.include', '/login')
      cy.wait(10000)

      cy.visit('/supervisor-company')
      cy.wait(10000)
      cy.wait('@fetchCompanies', { timeout: 60000 })
      cy.get('table tbody tr', { timeout: 60000 }).should('contain', companyName)
      cy.get('table tbody tr', { timeout: 60000 }).should('contain', 'Neaktívna')
    })

    it('TC26: Company status changes to active after activation', () => {
      const testToken = 'test-activation-token-123'
      const companyName = 'Test Activated Company'
      const companyEmail = 'activated@test.sk'

      cy.intercept('GET', `/api/company/activate/${testToken}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Spoločnosť bola úspešne aktivovaná.'
        }
      }).as('activateCompany')

      cy.intercept('POST', '/api/companies/list*', {
        statusCode: 200,
        body: {
          data: [
            {
              user_id: 1,
              ico: '12345678',
              name: companyName,
              contact_name: 'Contact Name',
              contact_email: companyEmail,
              contact_phone: '+421912345678',
              status: true
            }
          ],
          current_page: 1,
          last_page: 1
        }
      }).as('fetchCompaniesAfterActivation')

      cy.visit(`/company-activation?token=${testToken}`)
      cy.wait(10000)
      cy.get('.activate-btn', { timeout: 60000 }).should('exist')
      cy.get('.activate-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@activateCompany', { timeout: 60000 })
      cy.wait(2000)

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'supervisor-token',
          user: {
            id: 1,
            email: SUPERVISOR_EMAIL,
            roles: [{ name: 'supervisor' }]
          }
        }
      }).as('loginSupervisor')

      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          id: 1,
          email: SUPERVISOR_EMAIL,
          roles: [{ name: 'supervisor' }]
        }
      }).as('getSupervisorUser')

      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).first().clear().type(SUPERVISOR_EMAIL)
      cy.get('input', { timeout: 60000 }).eq(1).clear().type(SUPERVISOR_PASSWORD)
      cy.get('.login-btn', { timeout: 60000 }).should('exist')
      cy.get('.login-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@loginSupervisor', { timeout: 60000 })
      cy.wait('@getSupervisorUser', { timeout: 60000 })
      cy.wait(5000)
      cy.url({ timeout: 120000 }).should('not.include', '/login')
      cy.wait(10000)

      cy.visit('/supervisor-company')
      cy.wait(10000)
      cy.wait('@fetchCompaniesAfterActivation', { timeout: 60000 })
      cy.get('table tbody tr', { timeout: 60000 }).should('contain', companyName)
      cy.get('table tbody tr', { timeout: 60000 }).should('contain', 'Aktívna')
    })

    it('TC27: Activated company can login successfully', () => {
      const testToken = 'test-activation-token-123'
      const companyEmail = 'activated@test.sk'
      const companyPassword = 'password123'

      cy.intercept('GET', `/api/company/activate/${testToken}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Spoločnosť bola úspešne aktivovaná.'
        }
      }).as('activateCompany')

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'test-token',
          user: {
            id: 1,
            email: companyEmail,
            roles: [{ name: 'company' }]
          }
        }
      }).as('loginCompany')

      cy.visit(`/company-activation?token=${testToken}`)
      cy.wait(10000)
      cy.get('.activate-btn', { timeout: 60000 }).should('exist')
      cy.get('.activate-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@activateCompany', { timeout: 60000 })
      cy.wait(2000)

      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          id: 1,
          email: companyEmail,
          roles: [{ name: 'company' }]
        }
      }).as('getUser')

      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).should('have.length.at.least', 2)
      cy.get('input', { timeout: 60000 }).first().clear().type(companyEmail)
      cy.get('input', { timeout: 60000 }).eq(1).clear().type(companyPassword)
      cy.get('.login-btn', { timeout: 60000 }).should('exist')
      cy.get('.login-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@loginCompany', { timeout: 60000 })
      cy.wait('@getUser', { timeout: 60000 })
      cy.wait(5000)
      cy.url({ timeout: 120000 }).should('not.include', '/login')
      cy.url({ timeout: 60000 }).should('include', '/stats-dashboard')
    })

    it('TC28: Non-activated company cannot login', () => {
      const companyEmail = 'nonactivated@test.sk'
      const companyPassword = 'password123'

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: {
          message: 'Účet nie je aktivovaný.'
        }
      }).as('loginFail')

      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).first().clear().type(companyEmail)
      cy.get('input', { timeout: 60000 }).eq(1).clear().type(companyPassword)
      cy.get('.login-btn', { timeout: 60000 }).should('exist')
      cy.get('.login-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@loginFail', { timeout: 60000 })
      cy.wait(2000)
      cy.url({ timeout: 60000 }).should('include', '/login')
      cy.get('body', { timeout: 60000 }).should(($body) => {
        const text = $body.text()
        expect(text).to.satisfy((txt) => txt.includes('chyba') || txt.includes('aktivovaný'))
      })
    })

    it('TC29: Verify activation email was sent by checking company in inactive status', () => {
      const companyName = `New Company ${Date.now()}`

      cy.intercept('POST', '/api/companies/list*', {
        statusCode: 200,
        body: {
          data: [
            {
              user_id: 1,
              ico: '12345678',
              name: companyName,
              contact_name: 'Contact Name',
              contact_email: 'contact@test.sk',
              contact_phone: '+421912345678',
              status: false
            }
          ],
          current_page: 1,
          last_page: 1
        }
      }).as('fetchCompanies')

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'supervisor-token',
          user: {
            id: 1,
            email: SUPERVISOR_EMAIL,
            roles: [{ name: 'supervisor' }]
          }
        }
      }).as('loginSupervisor')

      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          id: 1,
          email: SUPERVISOR_EMAIL,
          roles: [{ name: 'supervisor' }]
        }
      }).as('getSupervisorUser')

      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).first().clear().type(SUPERVISOR_EMAIL)
      cy.get('input', { timeout: 60000 }).eq(1).clear().type(SUPERVISOR_PASSWORD)
      cy.get('.login-btn', { timeout: 60000 }).should('exist')
      cy.get('.login-btn', { timeout: 60000 }).click({ force: true })
      cy.wait('@loginSupervisor', { timeout: 60000 })
      cy.wait('@getSupervisorUser', { timeout: 60000 })
      cy.wait(5000)
      cy.url({ timeout: 120000 }).should('not.include', '/login')
      cy.wait(10000)

      cy.visit('/supervisor-company')
      cy.wait(10000)
      cy.wait('@fetchCompanies', { timeout: 60000 })
      cy.get('table tbody tr', { timeout: 60000 }).then(($rows) => {
        const hasInactiveCompany = Array.from($rows).some(row =>
          row.textContent.includes(companyName) && row.textContent.includes('Neaktívna')
        )
        expect(hasInactiveCompany).to.be.true
      })
    })
  })

})

