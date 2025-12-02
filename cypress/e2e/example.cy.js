describe('Home Page', () => {
  it('should load the home page', () => {
    cy.visit('/')  // uses baseUrl from config
    cy.contains('Practice CRM') // change to text on your homepage
  })
})
