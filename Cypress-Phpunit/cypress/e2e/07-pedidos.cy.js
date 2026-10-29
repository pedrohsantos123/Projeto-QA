// Exercícios 17 e 18
describe('Pedidos', () => {
  it('registra um pedido e baixa o estoque na quantidade correta', () => {
    cy.sufixo().then((s) => {
      const cliente = `Cliente Pedido ${s}`
      const produto = `Produto Pedido ${s}`

      cy.criarCliente({ nome: cliente })
      cy.criarProduto({ nome: produto, preco: '25.00', estoque: '10', estoqueMinimo: '2' })

      cy.estoqueDe(produto).then((antes) => {
        expect(antes).to.eq(10)

        cy.criarPedido({ cliente, produto, quantidade: 3, status: 'confirmed' })

        cy.get('[data-cy=sucesso]').should('contain', 'Pedido criado e estoque atualizado')
        cy.contains('[data-cy=pedido-row]', cliente).within(() => {
          cy.get('[data-cy=pedido-status]').should('have.text', 'confirmed')
          cy.contains('R$ 75,00') // 3 x 25,00
        })

        cy.estoqueDe(produto).should('eq', antes - 3)
      })
    })
  })

  it('não permite pedido com quantidade maior que o estoque', () => {
    cy.sufixo().then((s) => {
      const cliente = `Cliente Sem Estoque ${s}`
      const produto = `Produto Sem Estoque ${s}`

      cy.criarCliente({ nome: cliente })
      cy.criarProduto({ nome: produto, estoque: '2', estoqueMinimo: '1' })

      cy.criarPedido({ cliente, produto, quantidade: 5 })

      cy.location('pathname').should('eq', '/pedidos/create')
      cy.get('[data-cy=erros]').should('contain', 'Estoque insuficiente para este produto.')

      cy.estoqueDe(produto).should('eq', 2) // estoque intacto
      cy.visit('/pedidos')
      cy.contains(cliente).should('not.exist') // pedido não foi criado
    })
  })
})
