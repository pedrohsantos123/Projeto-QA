// Exercício 15 — comandos customizados

// Gera um sufixo único para evitar colisão entre execuções
Cypress.Commands.add('sufixo', () => cy.wrap(`${Date.now()}${Cypress._.random(100, 999)}`))

// cy.criarProduto({ nome, categoria, preco, estoque, estoqueMinimo, descricao })
Cypress.Commands.add('criarProduto', (dados = {}) => {
  const p = { categoria: 'Doces', preco: '10.00', estoque: '10', estoqueMinimo: '5', ...dados }
  cy.visit('/produtos/create')
  cy.get('[data-cy=produto-nome]').type(p.nome)
  cy.get('[data-cy=produto-categoria]').select(p.categoria)
  if (p.descricao) cy.get('[data-cy=produto-descricao]').type(p.descricao)
  cy.get('[data-cy=produto-preco]').clear().type(p.preco)
  cy.get('[data-cy=produto-estoque]').clear().type(p.estoque)
  cy.get('[data-cy=produto-estoque-minimo]').clear().type(p.estoqueMinimo)
  cy.get('[data-cy=salvar]').click()
  cy.location('pathname').should('eq', '/produtos')
})

// cy.criarCliente({ nome, email, telefone, endereco, cidade })
Cypress.Commands.add('criarCliente', (dados = {}) => {
  const c = { email: '', telefone: '', endereco: '', cidade: '', ...dados }
  cy.visit('/clientes/create')
  cy.get('[data-cy=cliente-nome]').type(c.nome)
  if (c.email) cy.get('[data-cy=cliente-email]').type(c.email)
  if (c.telefone) cy.get('[data-cy=cliente-telefone]').type(c.telefone)
  if (c.endereco) cy.get('[data-cy=cliente-endereco]').type(c.endereco)
  if (c.cidade) cy.get('[data-cy=cliente-cidade]').type(c.cidade)
  cy.get('[data-cy=salvar]').click()
  cy.location('pathname').should('eq', '/clientes')
})

// Seleciona em um <select> a option cujo texto CONTÉM o trecho informado
// (necessário porque as options de produto/pedido trazem preço e estoque no texto)
Cypress.Commands.add('selecionarOpcao', (seletor, trecho) => {
  cy.contains(`${seletor} option`, trecho).then(($opt) => {
    cy.get(seletor).select($opt.val())
  })
})

// Lê o estoque atual (número) de um produto na listagem
Cypress.Commands.add('estoqueDe', (nome) => {
  cy.visit('/produtos')
  return cy
    .contains('[data-cy=produto-row]', nome)
    .find('[data-cy=estoque]')
    .invoke('text')
    .then((t) => parseInt(t, 10))
})

// Cria um pedido pela interface
Cypress.Commands.add('criarPedido', ({ cliente, produto, quantidade, status = 'pending' }) => {
  cy.visit('/pedidos/create')
  cy.selecionarOpcao('[data-cy=pedido-cliente]', cliente)
  cy.selecionarOpcao('[data-cy=pedido-produto]', produto)
  cy.get('[data-cy=pedido-quantidade]').clear().type(String(quantidade))
  cy.get('[data-cy=pedido-status-select]').select(status)
  cy.get('[data-cy=salvar]').click()
})
