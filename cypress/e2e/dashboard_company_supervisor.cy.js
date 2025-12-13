describe('Dashboard – Company and Supervisor', () => {

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('401') ||
        err.message.includes('ResizeObserver') ||
        err.message.includes('Network Error') ||
        err.message.includes('ERR_CONNECTION_REFUSED') ||
        err.message.includes('Request failed with status code 401') ||
        err.message.includes('Cannot read properties') ||
        err.message.includes('StatsDashboard')) {
      return false
    }
  })

  const SUPERVISOR_EMAIL = 'jan.novak@ukf.sk'
  const SUPERVISOR_PASSWORD = 'heslo'
  const COMPANY_EMAIL = 'slovenske@gmail.com'
  const COMPANY_PASSWORD = 'password'

  describe('Supervisor Dashboard', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).should('have.length.at.least', 2)
      cy.get('input').first().clear().type(SUPERVISOR_EMAIL)
      cy.get('input').eq(1).clear().type(SUPERVISOR_PASSWORD)
      cy.get('.login-btn', { timeout: 60000 }).should('not.be.disabled').click()
      cy.wait(15000)
      cy.url({ timeout: 120000 }).should((url) => {
        expect(url).to.not.include('/login')
      })
      cy.wait(10000)
    })

    it('TC01: Navigate to supervisor dashboard', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.url({ timeout: 60000 }).should('include', '/stats-dashboard')
      cy.get('body', { timeout: 60000 }).should('be.visible')
    })

    it('TC02: Dashboard title and overview are visible', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('h1', { timeout: 60000 }).should('be.visible')
      cy.get('p.text-subtitle-1', { timeout: 60000 }).should('be.visible')
    })

    it('TC03: Summary statistics cards are displayed', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('.v-row .v-col .v-card', { timeout: 60000 }).should('have.length.at.least', 5)
      cy.get('.v-card .text-h4', { timeout: 60000 }).should('have.length.at.least', 5)
      cy.get('.v-card .v-icon', { timeout: 60000 }).should('have.length.at.least', 5)
    })

    it('TC04: "To Confirm Practice" table is visible for supervisor', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.contains('Praxí na potvrdenie', { timeout: 60000 }).should('exist')
      cy.get('.v-card-title .mdi-clock-outline', { timeout: 60000 }).should('exist')
      cy.get('table', { timeout: 60000 }).should('be.visible')
      cy.get('table thead th', { timeout: 60000 }).should('have.length.at.least', 3)
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Spoločnosť')
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Študent')
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Pozícia')
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Stav')
    })

    it('TC05: "Practice By Status" chart is visible', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.contains('Praxí podľa stavu', { timeout: 60000 }).should('exist')
      cy.get('.v-card-title .mdi-chart-bar', { timeout: 60000 }).should('exist')
      cy.get('.v-progress-linear', { timeout: 60000 }).should('have.length.at.least', 1)
      cy.get('.v-icon.mdi-circle', { timeout: 60000 }).should('have.length.at.least', 1)
    })

    it('TC06: Can click on practice row to open details', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('table tbody tr', { timeout: 60000 }).then(($rows) => {
        if ($rows.length > 0) {
          cy.wrap($rows).first().click({ force: true })
          cy.wait(5000)
          cy.get('.v-dialog', { timeout: 60000 }).should('be.visible')
        }
      })
    })

    it('TC07: Dashboard shows correct data after page reload', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('.v-card .text-h4', { timeout: 60000 }).then(($cards) => {
        const initialCount = $cards.length
        cy.reload()
        cy.wait(10000)
        cy.get('.v-card .text-h4', { timeout: 60000 }).should('have.length', initialCount)
      })
    })

    it('TC08: Company column is visible in table for supervisor', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('table thead', { timeout: 60000 }).within(() => {
        cy.contains('Spoločnosť', { timeout: 60000 }).should('exist')
      })
    })
  })

  describe('Company Dashboard', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.visit('/login')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).should('be.visible')
      cy.get('input', { timeout: 60000 }).should('have.length.at.least', 2)
      cy.get('input').first().clear().type(COMPANY_EMAIL)
      cy.get('input').eq(1).clear().type(COMPANY_PASSWORD)
      cy.get('.login-btn', { timeout: 60000 }).should('not.be.disabled').click()
      cy.wait(15000)
      cy.url({ timeout: 120000 }).should((url) => {
        expect(url).to.not.include('/login')
      })
      cy.wait(10000)
    })

    it('TC09: Navigate to company dashboard', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.url({ timeout: 60000 }).should('include', '/stats-dashboard')
      cy.get('body', { timeout: 60000 }).should('be.visible')
    })

    it('TC10: Company dashboard shows summary statistics', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('.v-row .v-col .v-card', { timeout: 60000 }).should('have.length.at.least', 5)
      cy.get('.v-card .text-h4', { timeout: 60000 }).should('have.length.at.least', 5)
      cy.get('.v-card .v-icon', { timeout: 60000 }).should('have.length.at.least', 5)
    })

    it('TC11: Company column is NOT visible in table for company user', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.get('table thead', { timeout: 60000 }).within(() => {
        cy.contains('Spoločnosť', { timeout: 60000 }).should('not.exist')
      })
    })

    it('TC12: Company dashboard shows "To Confirm Practice" table', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.contains('Praxí na potvrdenie', { timeout: 60000 }).should('exist')
      cy.get('.v-card-title .mdi-clock-outline', { timeout: 60000 }).should('exist')
      cy.get('table', { timeout: 60000 }).should('be.visible')
      cy.get('table thead th', { timeout: 60000 }).should('have.length.at.least', 3)
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Študent')
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Pozícia')
      cy.get('table thead', { timeout: 60000 }).should('contain', 'Stav')
    })

    it('TC13: Company dashboard shows "Practice By Status" chart', () => {
      cy.visit('/stats-dashboard')
      cy.wait(10000)
      cy.get('body', { timeout: 60000 }).then(($body) => {
        if ($body.find('.v-progress-circular').length > 0) {
          cy.wait(5000)
        }
      })
      cy.contains('Praxí podľa stavu', { timeout: 60000 }).should('exist')
      cy.get('.v-card-title .mdi-chart-bar', { timeout: 60000 }).should('exist')
      cy.get('.v-progress-linear', { timeout: 60000 }).should('have.length.at.least', 1)
      cy.get('.v-icon.mdi-circle', { timeout: 60000 }).should('have.length.at.least', 1)
    })
  })

})

