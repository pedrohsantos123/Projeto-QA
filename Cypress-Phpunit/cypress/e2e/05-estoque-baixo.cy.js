// Exercício 13
describe('Alerta de estoque baixo', () => {
  it('destaca produto com estoque abaixo do mínimo', () => {
    const nome = `Baixo ${Date.now()}`
    cy.criarProduto({ nome, estoque: '2', estoqueMinimo: '5' })
    cy.contains('[data-cy=produto-row]', nome)
      .find('[data-cy=estoque]')
      .should('have.class', 'estoque-baixo')
      .and('have.css', 'background-color', 'rgb(255, 224, 215)') // #ffe0d7
  })

  it('não destaca produto com estoque acima do mínimo', () => {
    const nome = `Normal ${Date.now()}`
    cy.criarProduto({ nome, estoque: '20', estoqueMinimo: '5' })
    cy.contains('[data-cy=produto-row]', nome)
      .find('[data-cy=estoque]')
      .should('not.have.class', 'estoque-baixo')
      .and('not.have.css', 'background-color', 'rgb(255, 224, 215)')
  })
})
