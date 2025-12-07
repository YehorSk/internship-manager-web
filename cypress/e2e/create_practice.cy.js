Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('401')) return false
})
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver')) {
    return false
  }
})

describe('Student – Create Practice Flow', () => {

  beforeEach(() => {
    cy.viewport(1280, 800)

    cy.visit('/login')

    cy.get('input[type="email"]').type('john.student@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('.login-btn').click()

    cy.url().should('include', '/student-dashboard')

    cy.contains('Zoznam praxí').click()
    cy.url().should('include', '/student-praxe')
  })

  it('TC01: Open create practice dialog from list', () => {
    cy.contains('Pridať prax').click()
    cy.contains('Vytvoriť novú prax').should('exist')
  })

  it('TC02: Empty form cannot be submitted', () => {
    cy.contains('Pridať prax').click()
    cy.contains('Uložiť prax').click()
    cy.contains('Povinné pole').should('exist')
  })

  it('TC03: Create practice with existing company (UI only)', () => {
    cy.contains('Pridať prax').click()

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(0)
      .click({ force: true })
      .type('s', { force: true })

    cy.wait(600)

    cy.get('.v-list-item')
      .contains('Energo Slovensko')
      .click({ force: true })

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(1)
      .click({ force: true })
      .type('Informatics', { force: true })

    cy.wait(600)

    cy.get('.v-overlay__content:visible')
      .find('.v-list-item')
      .contains('Bachelor in Informatics')
      .click({ force: true })

    cy.get('.v-dialog:visible')
      .find('input[placeholder="Napr. Frontend Developer"]')
      .type('Frontend Developer', { force: true })


    cy.get('.v-dialog:visible')
      .find('textarea')
      .type('Testovací popis', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[type="date"]')
      .first()
      .type('2025-05-01', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[type="date"]')
      .last()
      .type('2025-06-30', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(2)
      .click({ force: true })

    cy.get('.v-list-item')
      .contains('Letný')
      .click({ force: true })

    cy.contains('Akademický rok')
      .parent()
      .find('input')
      .click({ force: true })
      .type('202', { force: true })

    cy.wait(600)

    cy.get('.v-list-item')
      .contains('2025/2026')
      .click({ force: true })


    cy.contains('Uložiť prax').click({ force: true })

    cy.contains('Praxe bola úspešne vytvorená.')
      .should('be.visible')

  })


  it('TC04: Create practice with new employer (UI only)', () => {
    cy.contains('Pridať prax').click()

    cy.contains('Nový zamestnávateľ').click({ force: true })
    cy.contains('Pridať nového zamestnávateľa').click({ force: true })

    cy.get('.v-dialog:visible').within(() => {
      cy.get('input[placeholder="Zadajte IČO"]').type('87654321')
      cy.get('input[placeholder="Zadajte názov spoločnosti"]').type('Nova Firma')
      cy.get('input[placeholder="Zadajte adresu spoločnosti"]').type('Košice')
      cy.get('input[placeholder="Zadajte meno kontaktnej osoby"]').type('Kontakt 2')

      cy.get('input[type="email"]').first().type('firma2@test.sk')
      cy.get('input[type="email"]').last().type('kontakt2@test.sk')

      cy.get('input').eq(6).type('+421911111111')
      cy.get('input').eq(7).type('CTO')

      cy.contains('Uložiť').click()
    })

    cy.wait(600)

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(0)
      .click({ force: true })

    cy.wait(400)

    cy.get('.v-overlay__content')
      .find('.v-list-item')
      .contains('Bachelor in Informatics')
      .click({ force: true })

    cy.get('.v-dialog:visible')
      .find('input[placeholder="Napr. Frontend Developer"]')
      .type('Frontend Developer', { force: true })

    cy.get('.v-dialog:visible')
      .find('textarea')
      .type('Testovací popis', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[type="date"]')
      .eq(0)
      .type('2025-05-01', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[type="date"]')
      .eq(1)
      .type('2025-06-30', { force: true })

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(1)
      .click({ force: true })

    cy.get('.v-overlay__content:visible')
      .find('.v-list-item')
      .contains('Letný')
      .click({ force: true })

    cy.get('.v-dialog:visible')
      .find('input[role="combobox"]')
      .eq(2)
      .click({ force: true })
      .type('202', { force: true })

    cy.wait(600)

    cy.get('.v-overlay__content:visible')
      .find('.v-list-item')
      .contains('2025/2026')
      .click({ force: true })

    cy.contains('Uložiť prax').click({ force: true })

    cy.contains('Praxe bola úspešne vytvorená.')
      .should('be.visible')
  })


  it('TC05: Backend error while creating practice', () => {
    cy.intercept('POST', '/api/practices/', {
      statusCode: 500,
      body: {}
    }).as('createFail')

    cy.contains('Pridať prax').click()
    cy.contains('Uložiť prax').click()

    cy.wait('@createFail')
    cy.contains('Neočakávaná chyba servera')
      .should('be.visible')
  })

  it('TC06: Close create practice dialog', () => {
    cy.contains('Pridať prax').click()
    cy.contains('Zrušiť').click()
    cy.contains('Vytvoriť novú prax').should('not.exist')
  })

})
