// Exercício 19
describe('Fluxo de frete', () => {
  it('cria um frete e atualiza o status até a entrega', () => {
    cy.sufixo().then((s) => {
      const cliente = `Cliente Frete ${s}`
      const produto = `Produto Frete ${s}`
      const endereco = `Rua do Frete ${s}`

      cy.criarCliente({ nome: cliente })
      cy.criarProduto({ nome: produto, estoque: '10' })
      cy.criarPedido({ cliente, produto, quantidade: 1 })

      // cria o frete vinculado ao pedido
      cy.visit('/entregas/create')
      cy.selecionarOpcao('[data-cy=entrega-pedido]', cliente)
      cy.get('[data-cy=entrega-endereco]').type(endereco)
      cy.get('[data-cy=entrega-cidade]').type('Campinas')
      cy.get('[data-cy=entrega-taxa]').clear().type('12.50')
      cy.get('[data-cy=entrega-data]').type('2026-12-20')
      cy.get('[data-cy=entrega-rastreio]').type(`BR${s}`)
      cy.get('[data-cy=salvar]').click()

      cy.get('[data-cy=sucesso]').should('contain', 'Entrega cadastrada')
      cy.contains('[data-cy=entrega-row]', endereco).within(() => {
        cy.contains('R$ 12,50')
        cy.contains('20/12/2026')
        cy.get('[data-cy=entrega-status]').should('have.text', 'scheduled')
      })

      // scheduled -> in_transit -> delivered
      ;['in_transit', 'delivered'].forEach((status) => {
        cy.contains('[data-cy=entrega-row]', endereco).find('[data-cy=editar-entrega]').click()
        cy.get('[data-cy=entrega-status-select]').select(status)
        cy.get('[data-cy=salvar]').click()

        cy.get('[data-cy=sucesso]').should('contain', 'Entrega atualizada')
        cy.contains('[data-cy=entrega-row]', endereco)
          .find('[data-cy=entrega-status]')
          .should('have.text', status)
      })
    })
  })
})
