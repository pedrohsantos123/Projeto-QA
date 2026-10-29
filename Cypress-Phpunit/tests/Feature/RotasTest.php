<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RotasTest extends TestCase
{
    use RefreshDatabase;

    // Exercício 22
    public function test_rota_inicial_responde_200(): void
    {
        $this->get('/')->assertStatus(200);
    }

    // Exercício 23
    public function test_listagens_dos_modulos_respondem_200(): void
    {
        $this->get('/produtos')->assertStatus(200);
        $this->get('/clientes')->assertStatus(200);
        $this->get('/pedidos')->assertStatus(200);
        $this->get('/entregas')->assertStatus(200); // "Fretes" no menu
    }

    // Exercício 25
    public function test_rota_inexistente_retorna_404(): void
    {
        $this->get('/rota-que-nao-existe')->assertNotFound();
    }
}
