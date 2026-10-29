// Exercícios 7, 8, 9, 10, 11 e 14
describe('Produtos - cadastro, validação, edição e exclusão', () => {
  // Desliga a validação HTML5 do navegador para testar as mensagens do servidor (Laravel)
  const semValidacaoHtml = () => cy.get('form[action$="/produtos"]').invoke('attr', 'novalidate', 'novalidate')

  context('Cadastro (fixture)', () => {
    it('cadastra um produto usando cy.fixture()', () => {
      cy.fixture('produto').then((produto) => {
        const nome = `${produto.nome} ${Date.now()}`
        cy.visit('/produtos/create')
        cy.get('[data-cy=produto-nome]').type(nome)
        cy.get('[data-cy=produto-categoria]').select(produto.categoria)
        cy.get('[data-cy=produto-descricao]').type(produto.descricao)
        cy.get('[data-cy=produto-preco]').clear().type(produto.preco)
        cy.get('[data-cy=produto-estoque]').clear().type(produto.estoque)
        cy.get('[data-cy=produto-estoque-minimo]').clear().type(produto.estoqueMinimo)
        cy.get('[data-cy=salvar]').click()

        cy.location('pathname').should('eq', '/produtos')
        cy.get('[data-cy=sucesso]').should('contain', 'Produto cadastrado com sucesso')
        cy.contains('[data-cy=produto-row]', nome).should('contain', 'R$ 48,90')
      })
    })
  })

  context('Validações', () => {
    beforeEach(() => {
      cy.visit('/produtos/create')
      semValidacaoHtml()
    })

    it('mostra erro para cada campo obrigatório com o formulário vazio', () => {
      cy.get('[data-cy=produto-estoque]').clear()
      cy.get('[data-cy=produto-estoque-minimo]').clear()
      cy.get('[data-cy=salvar]').click()

      cy.get('[data-cy=erros]').should('be.visible')
      cy.get('[data-cy=erros] li').should('have.length', 5)
      ;['name', 'category', 'price', 'stock', 'minimum stock'].forEach((campo) => {
        cy.get('[data-cy=erros]').invoke('text').should('match', new RegExp(`${campo} field is required`, 'i'))
      })
    })

    it('rejeita preço negativo', () => {
      cy.get('[data-cy=produto-nome]').type('Produto preço negativo')
      cy.get('[data-cy=produto-categoria]').select('Doces')
      cy.get('[data-cy=produto-preco]').clear().type('-5')
      cy.get('[data-cy=salvar]').click()
      cy.get('[data-cy=erros]').invoke('text').should('match', /price field must be at least 0/i)
    })

    it('rejeita estoque negativo', () => {
      cy.get('[data-cy=produto-nome]').type('Produto estoque negativo')
      cy.get('[data-cy=produto-categoria]').select('Doces')
      cy.get('[data-cy=produto-preco]').clear().type('10')
      cy.get('[data-cy=produto-estoque]').clear().type('-3')
      cy.get('[data-cy=salvar]').click()
      cy.get('[data-cy=erros]').invoke('text').should('match', /stock field must be at least 0/i)
    })

    it('rejeita texto em campos numéricos', () => {
      cy.get('[data-cy=produto-nome]').type('Produto texto no preço')
      cy.get('[data-cy=produto-categoria]').select('Doces')
      // input type=number ignora letras: o campo fica vazio e o servidor acusa "obrigatório"
      cy.get('[data-cy=produto-preco]').clear().type('abc')
      cy.get('[data-cy=produto-preco]').should('have.value', '')
      cy.get('[data-cy=salvar]').click()
      cy.get('[data-cy=erros]').invoke('text').should('match', /price field is required/i)
    })
  })

  context('Edição e exclusão', () => {
    it('edita o preço de um produto existente', () => {
      cy.visit('/produtos')
      cy.get('[data-cy=produto-row]').first().find('[data-cy=editar-produto]').click()
      cy.url().should('match', /\/produtos\/\d+\/edit/)
      cy.get('[data-cy=produto-preco]').clear().type('99.90')
      cy.get('[data-cy=salvar]').click()

      cy.location('pathname').should('eq', '/produtos')
      cy.get('[data-cy=sucesso]').should('contain', 'Produto atualizado com sucesso')
      cy.get('[data-cy=produto-row]').first().should('contain', 'R$ 99,90')
    })

    it('exclui um produto de teste (confirm do navegador)', () => {
      const nome = `Produto Excluir ${Date.now()}`
      cy.criarProduto({ nome })
      cy.contains('[data-cy=produto-row]', nome).should('exist')

      cy.on('window:confirm', (texto) => {
        expect(texto).to.equal('Remover produto?')
        return true
      })
      cy.contains('[data-cy=produto-row]', nome).find('[data-cy=excluir-produto]').click()

      cy.get('[data-cy=sucesso]').should('contain', 'Produto removido')
      cy.contains(nome).should('not.exist')
    })
  })
})
