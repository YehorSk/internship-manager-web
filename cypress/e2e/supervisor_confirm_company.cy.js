Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('401') ||
      err.message.includes('ResizeObserver') ||
      err.message.includes('StatsDashboard.vue') ||
      err.message.includes('Cannot read properties') ||
      err.message.includes('at Context.eval') ||
      err.message.includes('shouldFn') ||
      err.message.includes('cypress_runner') ||
      err.message.includes('timedOutWaitingForPageLoad')) {
    return false
  }
})

describe('Supervisor Confirm Company', () => {

  beforeEach(() => {
    cy.viewport(1280, 800)

    cy.visit('/login', { timeout: 60000 })
    cy.wait(1500)

    cy.get('input[type="email"]', { timeout: 10000 }).type('jan.novak@ukf.sk')
    cy.get('input[type="password"]', { timeout: 10000 }).type('heslo')
    cy.get('.login-btn', { timeout: 10000 }).click()

    cy.wait(15000)
  })

  it('TC01: Navigate to companies page', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.contains('Firmy', { timeout: 10000 }).should('be.visible')
    cy.url().should('include', '/supervisor-company')
  })

  it('TC02: Companies table is visible with data', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table', { timeout: 10000 }).should('be.visible')
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('TC03: Confirm company successfully', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').first().should('be.visible').click({ force: true })
    })
    
    cy.wait(600)
    cy.get('body', { timeout: 10000 }).should('contain', 'úspešne')
    
    cy.wait(600)
    cy.reload()
    cy.wait(600)
    
    cy.get('table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('td').eq(5).should('contain', 'Aktívna')
    })
  })

  it('TC04: Reject company successfully', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').last().should('be.visible').click({ force: true })
    })
    
    cy.wait(600)
    cy.get('body', { timeout: 10000 }).should('contain', 'úspešne')
    
    cy.wait(600)
    cy.reload()
    cy.wait(600)
    
    cy.get('table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('td').eq(5).should('contain', 'Neaktívna')
    })
  })

  it('TC05: Handle error when company confirmation fails', () => {
    cy.intercept('PATCH', '/api/companies/*', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('confirmFail')
    
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').first().should('be.visible').click({ force: true })
    })
    
    cy.wait('@confirmFail', { timeout: 10000 })
    cy.wait(600)
    cy.get('body', { timeout: 10000 }).should('contain', 'chyba')
  })

  it('TC06: Confirm button is visible for inactive companies', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('td').last().within(() => {
        cy.get('button').should('have.length.at.least', 2)
      })
    })
  })

  it('TC07: Company status changes after confirmation', () => {
    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(600)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    
    cy.get('table tbody tr').first().then(($row) => {
      const companyName = $row.find('td').eq(1).text().trim()
      
      cy.wrap($row).find('td').last().within(() => {
        cy.get('button').first().should('be.visible').click({ force: true })
      })
      
      cy.wait(600)
      cy.get('body').should('contain', 'úspešne')
      
      cy.wait(600)
      cy.reload()
      cy.wait(600)
      
      cy.get('table tbody tr', { timeout: 10000 }).contains(companyName).parent().within(() => {
        cy.get('td').eq(5).should('contain', 'Aktívna')
      })
    })
  })

})

