import { defineConfig } from 'cypress'
import { execSync } from 'node:child_process'

// Exercício 20: recria o banco (migrate:fresh --seed) dentro do container.
function resetarBanco() {
  execSync('docker compose exec -T app php artisan migrate:fresh --seed --force', {
    stdio: 'inherit',
  })
  return null
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    video: false,
    setupNodeEvents(on) {
      // Roda uma vez antes de toda a suíte (npx cypress run)
      on('before:run', () => {
        resetarBanco()
      })
      // Também disponível dentro dos testes: cy.task('resetarBanco')
      on('task', { resetarBanco })
    },
  },
})
