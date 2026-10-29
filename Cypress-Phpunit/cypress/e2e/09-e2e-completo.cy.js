// Exercício 20 — cy.intercept + task de reset do banco + fluxo ponta a ponta
describe('E2E: cliente -> produto -> pedido -> frete', () => {
  before(() => {
    cy.task('resetarBanco') // php artisan migrate:fresh --seed (via docker compose exec)
  })

  it('percorre o fluxo completo e valida o POST de criação do pedido', () => {
    const cliente = 'Cliente E2E'
    const produto = 'Produto E2E'

    cy.criarCliente({ nome: cliente, cidade: 'Campinas', endereco: 'Rua E2E, 1' })
    cy.criarProduto({ nome: produto, preco: '40.00', estoque: '8', estoqueMinimo: '2' })

    // monitora o POST de criação do pedido
    cy.intercept('POST', '/pedidos').as('criarPedido')

    cy.visit('/pedidos/create')
    cy.selecionarOpcao('[data-cy=pedido-cliente]', cliente)
    cy.selecionarOpcao('[data-cy=pedido-produto]', produto)
    cy.get('[data-cy=pedido-quantidade]').clear().type('2')
    cy.get('[data-cy=salvar]').click()

    // o Laravel responde 302 (redirect para /pedidos) após salvar com sucesso
    cy.wait('@criarPedido').its('response.statusCode').should('eq', 302)
    cy.location('pathname').should('eq', '/pedidos')
    cy.contains('[data-cy=pedido-row]', cliente).should('contain', 'R$ 80,00')

    // frete
    cy.visit('/entregas/create')
    cy.selecionarOpcao('[data-cy=entrega-pedido]', cliente)
    cy.get('[data-cy=entrega-endereco]').type('Rua E2E, 1')
    cy.get('[data-cy=entrega-cidade]').type('Campinas')
    cy.get('[data-cy=entrega-taxa]').clear().type('15')
    cy.get('[data-cy=salvar]').click()
    cy.contains('[data-cy=entrega-row]', cliente).should('contain', 'scheduled')

    // estoque 8 - 2 = 6
    cy.estoqueDe(produto).should('eq', 6)
  })
})
