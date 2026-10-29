// Exercícios 4 e 5
describe('Produtos - listagem e formulário', () => {
  beforeEach(() => {
    cy.visit('/produtos')
  })

  it('mostra a tabela com dados do seed e cabeçalhos principais', () => {
    cy.get('[data-cy=tabela-produtos]').should('exist')
    cy.get('[data-cy=produto-row]').should('have.length.at.least', 1)
    ;['Produto', 'Categoria', 'Preço', 'Estoque'].forEach((cab) => {
      cy.get('[data-cy=tabela-produtos] th').contains(cab)
    })
  })

  it('abre o formulário de novo produto com todos os campos', () => {
    cy.get('[data-cy=novo-produto]').click()
    cy.url().should('include', '/produtos/create')
    cy.get('[data-cy=produto-nome]').should('exist')
    cy.get('[data-cy=produto-categoria]').should('exist').and('match', 'select')
    cy.get('[data-cy=produto-preco]').should('exist')
    cy.get('[data-cy=produto-estoque]').should('exist')
    cy.get('[data-cy=produto-estoque-minimo]').should('exist')
  })
})
