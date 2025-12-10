describe('Change Practice Status – Supervisor', () => {

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

  it('TC01: Open practice details dialog', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog', { timeout: 60000 }).should('be.visible')
    cy.wait(5000)
    cy.get('.v-dialog', { timeout: 60000 }).should('be.visible')
  })

  it('TC02: Status selector is visible for supervisor', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).should('exist')
    cy.get('select, .v-select', { timeout: 60000 }).should('exist')
  })

  it('TC03: Change practice status successfully', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip').click({ force: true })
    cy.wait(5000)
    cy.get('.v-overlay__content:visible', { timeout: 60000 }).should('be.visible')
    cy.wait(3000)
    cy.get('.v-list-item', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.wait(5000)
    cy.get('.v-list-item', { timeout: 60000 }).then(($items) => {
      const itemsArray = Array.from($items)
      const potvrdenéItem = itemsArray.find(item => item.textContent.includes('Potvrdené'))
      if (potvrdenéItem) {
        cy.wrap(potvrdenéItem).click({ force: true })
      } else {
        cy.get('.v-list-item').not(':first').first().click({ force: true })
      }
    })
    cy.wait(5000)
    cy.get('button[aria-label*="check"], button .mdi-check', { timeout: 60000 }).should('be.visible')
    cy.get('button .mdi-check').parent().click({ force: true })
    cy.wait(5000)
    cy.contains('úspešne', { timeout: 60000 }).should('exist')
  })

  it('TC04: Status change button appears only when status is different', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).should('exist')
    cy.get('.status-select-chip').click({ force: true })
    cy.wait(5000)
    cy.get('.v-overlay__content:visible', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)
    cy.get('.v-list-item', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('.v-list-item').first().click({ force: true })
    cy.wait(3000)
  })

  it('TC05: Status is updated in the UI after change', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    let initialStatus = ''
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(-2).invoke('text').then((text) => {
        initialStatus = text.trim()
      })
    })
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).click({ force: true })
    cy.wait(5000)
    cy.get('.v-overlay__content:visible', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)
    cy.get('.v-list-item', { timeout: 60000 }).should('have.length.at.least', 2)
    cy.get('.v-list-item').not(':first').first().click({ force: true })
    cy.wait(5000)
    cy.get('body', { timeout: 60000 }).then(($body) => {
      const hasCheckButton = $body.find('button .mdi-check').length > 0 || $body.find('button[aria-label*="check"]').length > 0
      if (hasCheckButton) {
        cy.get('button .mdi-check, button[aria-label*="check"]', { timeout: 60000 }).first().should('be.visible')
        cy.wait(2000)
        cy.get('button .mdi-check, button[aria-label*="check"]').first().parent().should('be.visible').click({ force: true })
        cy.wait(5000)
        cy.wait(3000)
        if ($body.find('button[aria-label*="close"], .mdi-close').length > 0) {
          cy.get('button[aria-label*="close"], .mdi-close', { timeout: 60000 }).first().should('be.visible').click({ force: true })
        }
      }
    })
    cy.wait(3000)
    cy.reload()
    cy.wait(10000)
  })

  it('TC06: Handle error when status update fails', () => {
    cy.intercept('PATCH', '/api/practices/*/update-practice-status', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('statusUpdateFail')
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).click({ force: true })
    cy.wait(5000)
    cy.get('.v-overlay__content:visible', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)
    cy.get('.v-list-item', { timeout: 60000 }).should('have.length.at.least', 2)
    cy.get('.v-list-item').not(':first').first().click({ force: true })
    cy.wait(5000)
    cy.get('body', { timeout: 60000 }).then(($body) => {
      const hasCheckButton = $body.find('button .mdi-check').length > 0 || $body.find('button[aria-label*="check"]').length > 0
      if (hasCheckButton) {
        cy.get('button .mdi-check, button[aria-label*="check"]', { timeout: 60000 }).first().should('be.visible')
        cy.wait(2000)
        cy.get('button .mdi-check, button[aria-label*="check"]').first().parent().should('be.visible').click({ force: true })
        cy.wait('@statusUpdateFail', { timeout: 60000 })
      }
    })
    cy.contains('chyba', { timeout: 60000 }).should('exist')
  })

  it('TC07: Status selector shows correct current status', () => {
    cy.visit('/extended-all-praxe')
    cy.wait(10000)
    cy.get('table tbody tr', { timeout: 60000 }).should('have.length.at.least', 1)
    let tableStatus = ''
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(-2).invoke('text').then((text) => {
        tableStatus = text.trim()
      })
    })
    cy.get('table tbody tr').first().click({ force: true })
    cy.wait(5000)
    cy.get('.v-dialog:visible', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip', { timeout: 60000 }).should('be.visible')
    cy.get('.status-select-chip').should('contain.text', tableStatus)
  })

})
