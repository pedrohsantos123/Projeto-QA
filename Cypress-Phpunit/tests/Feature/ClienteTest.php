<?php

namespace Tests\Feature;

use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteTest extends TestCase
{
    use RefreshDatabase;

    // Exercício 27
    public function test_cadastra_cliente_via_post(): void
    {
        $response = $this->post('/clientes', [
            'name' => 'Carla Mendes',
            'email' => 'carla@example.com',
            'phone' => '(11) 95555-0000',
            'address' => 'Rua Verde, 10',
            'city' => 'Santos',
        ]);

        $response->assertRedirect(route('clientes.index'));
        $this->assertDatabaseHas('customers', [
            'name' => 'Carla Mendes',
            'email' => 'carla@example.com',
        ]);
    }

    // Exercício 29 (parte do cliente)
    public function test_exclui_cliente_com_delete(): void
    {
        $cliente = Customer::create(['name' => 'Cliente Temporário']);

        $this->delete(route('clientes.destroy', $cliente))
            ->assertRedirect(route('clientes.index'));

        $this->assertDatabaseMissing('customers', ['id' => $cliente->id]);
    }
}
