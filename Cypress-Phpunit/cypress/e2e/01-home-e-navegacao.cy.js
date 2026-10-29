// Exercícios 2, 3 e 6
describe('Página inicial e navegação', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('exibe o nome do sistema', () => {
    cy.contains('Doce Gestão').should('be.visible')
    cy.get('[data-cy=titulo]').should('contain', 'Painel da confeitaria')
  })

  const links = [
    { cy: 'nav-produtos', url: '/produtos' },
    { cy: 'nav-clientes', url: '/clientes' },
    { cy: 'nav-pedidos', url: '/pedidos' },
    { cy: 'nav-fretes', url: '/entregas' },
  ]

  links.forEach(({ cy: alvo, url }) => {
    it(`navega pelo menu para ${url}`, () => {
      cy.get(`[data-cy=${alvo}]`).click()
      cy.url().should('include', url)
    })
  })
})
