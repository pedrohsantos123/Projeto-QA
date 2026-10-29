// Exercício 16 (a listagem pagina de 10 em 10 e ordena do mais novo para o mais antigo)
describe('Paginação de produtos', () => {
  before(() => {
    // Seed tem 3 produtos; criamos 8 para passar do limite de 10 (total >= 11)
    cy.sufixo().then((s) => {
      Cypress._.times(8, (i) => cy.criarProduto({ nome: `Paginação ${s}-${i + 1}` }))
    })
  })

  it('vai para a próxima página e volta para a anterior', () => {
    cy.visit('/produtos')
    cy.get('[data-cy=produto-row]').should('have.length', 10)

    cy.get('[data-cy=produto-row]').first().invoke('text').then((primeiraPagina1) => {
      cy.get('a[rel=next]').first().click()
      cy.url().should('include', 'page=2')
      cy.get('[data-cy=produto-row]').should('have.length.at.least', 1)
      cy.get('[data-cy=produto-row]').first().invoke('text').should('not.eq', primeiraPagina1)

      // página anterior continua acessível
      cy.get('a[rel=prev]').first().click()
      cy.get('[data-cy=produto-row]').first().invoke('text').should('eq', primeiraPagina1)
    })
  })
})
