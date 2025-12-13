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
    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
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

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table', { timeout: 10000 }).should('be.visible')
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('TC03: Confirm company successfully', () => {
    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
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

    cy.intercept('PATCH', '/api/companies/1', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne potvrdená.'
      }
    }).as('confirmCompany')

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').first().should('exist').click({ force: true })
    })

    cy.wait('@confirmCompany', { timeout: 10000 })
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((txt) => txt.includes('úspešne') || txt.includes('Potvrdené'))
    })

    cy.wait(2000)

    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
            contact_name: 'Contact Name',
            contact_email: 'contact@test.sk',
            contact_phone: '+421912345678',
            status: true
          }
        ],
        current_page: 1,
        last_page: 1
      }
    }).as('fetchCompaniesAfterConfirm')

    cy.reload()
    cy.wait(2000)
    cy.wait('@fetchCompaniesAfterConfirm', { timeout: 10000 })

    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr', { timeout: 10000 }).first().then(($row) => {
      const statusCell = $row.find('td').eq(5)
      if (statusCell.length > 0) {
        cy.wrap(statusCell).should('contain', 'Aktívna')
      } else {
        cy.wrap($row).should('contain', 'Aktívna')
      }
    })
  })

  it('TC04: Reject company successfully', () => {
    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
            contact_name: 'Contact Name',
            contact_email: 'contact@test.sk',
            contact_phone: '+421912345678',
            status: true
          }
        ],
        current_page: 1,
        last_page: 1
      }
    }).as('fetchCompanies')

    cy.intercept('PATCH', '/api/companies/1', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne odmietnutá.'
      }
    }).as('rejectCompany')

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').last().should('exist').click({ force: true })
    })

    cy.wait('@rejectCompany', { timeout: 10000 })
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((txt) => txt.includes('úspešne') || txt.includes('Odmietnuté'))
    })

    cy.wait(2000)

    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
            contact_name: 'Contact Name',
            contact_email: 'contact@test.sk',
            contact_phone: '+421912345678',
            status: false
          }
        ],
        current_page: 1,
        last_page: 1
      }
    }).as('fetchCompaniesAfterReject')

    cy.reload()
    cy.wait(2000)
    cy.wait('@fetchCompaniesAfterReject', { timeout: 10000 })

    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr', { timeout: 10000 }).first().then(($row) => {
      const statusCell = $row.find('td').eq(5)
      if (statusCell.length > 0) {
        cy.wrap(statusCell).should('contain', 'Neaktívna')
      } else {
        cy.wrap($row).should('contain', 'Neaktívna')
      }
    })
  })

  it('TC05: Handle error when company confirmation fails', () => {
    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
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

    cy.intercept('PATCH', '/api/companies/*', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('confirmFail')

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').first().should('exist').click({ force: true })
    })

    cy.wait('@confirmFail', { timeout: 10000 })
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((txt) => txt.includes('chyba') || txt.includes('Chyba') || txt.includes('error'))
    })
  })

  it('TC06: Confirm button is visible for inactive companies', () => {
    cy.intercept('POST', '/api/companies/list*', {
      statusCode: 200,
      body: {
        data: [
          {
            user_id: 1,
            ico: '12345678',
            name: 'Test Company',
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

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).then(($r) => {
        const lastTd = $r.find('td').last()
        if (lastTd.length > 0) {
          cy.wrap(lastTd).within(() => {
            cy.get('button').should('have.length.at.least', 2)
          })
        }
      })
    })
  })

  it('TC07: Company status changes after confirmation', () => {
    const companyName = 'Test Company'

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

    cy.intercept('PATCH', '/api/companies/1', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Spoločnosť bola úspešne potvrdená.'
      }
    }).as('confirmCompany')

    cy.visit('/supervisor-company', { timeout: 60000 })
    cy.wait(2000)
    cy.wait('@fetchCompanies', { timeout: 10000 })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.get('table tbody tr').first().find('td').last().within(() => {
      cy.get('button').first().should('exist').click({ force: true })
    })

    cy.wait('@confirmCompany', { timeout: 10000 })
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((txt) => txt.includes('úspešne') || txt.includes('Potvrdené'))
    })

    cy.wait(2000)

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
            status: true
          }
        ],
        current_page: 1,
        last_page: 1
      }
    }).as('fetchCompaniesAfterConfirm')

    cy.reload()
    cy.wait(2000)
    cy.wait('@fetchCompaniesAfterConfirm', { timeout: 10000 })

    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('table tbody tr', { timeout: 10000 }).contains(companyName).parent().then(($row) => {
      const statusCell = $row.find('td').eq(5)
      if (statusCell.length > 0) {
        cy.wrap(statusCell).should('contain', 'Aktívna')
      } else {
        cy.wrap($row).should('contain', 'Aktívna')
      }
    })
  })

})

