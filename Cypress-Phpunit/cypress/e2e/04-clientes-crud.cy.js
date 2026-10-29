// Exercício 12 (CRUD em um único fluxo) + uso de fixture (14)
describe('Clientes - CRUD', () => {
  it('cria, edita e exclui um cliente', () => {
    cy.fixture('cliente').then((cliente) => {
      const nome = `${cliente.nome} ${Date.now()}`

      // CREATE
      cy.visit('/clientes')
      cy.get('[data-cy=novo-cliente]').click()
      cy.get('[data-cy=cliente-nome]').type(nome)
      cy.get('[data-cy=cliente-email]').type(cliente.email)
      cy.get('[data-cy=cliente-telefone]').type(cliente.telefone)
      cy.get('[data-cy=cliente-endereco]').type(cliente.endereco)
      cy.get('[data-cy=cliente-cidade]').type(cliente.cidade)
      cy.get('[data-cy=salvar]').click()

      cy.get('[data-cy=sucesso]').should('contain', 'Cliente cadastrado com sucesso')
      cy.contains('[data-cy=cliente-row]', nome)
        .should('contain', cliente.email)
        .and('contain', cliente.telefone)
        .and('contain', cliente.endereco)
        .and('contain', cliente.cidade)

      // UPDATE
      cy.contains('[data-cy=cliente-row]', nome).find('[data-cy=editar-cliente]').click()
      cy.get('[data-cy=cliente-cidade]').clear().type('Sorocaba')
      cy.get('[data-cy=salvar]').click()
      cy.get('[data-cy=sucesso]').should('contain', 'Cliente atualizado com sucesso')
      cy.contains('[data-cy=cliente-row]', nome).should('contain', 'Sorocaba')

      // DELETE
      cy.on('window:confirm', () => true)
      cy.contains('[data-cy=cliente-row]', nome).find('[data-cy=excluir-cliente]').click()
      cy.get('[data-cy=sucesso]').should('contain', 'Cliente removido')
      cy.contains(nome).should('not.exist')
    })
  })
})
