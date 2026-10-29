<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BaixaEstoqueTest extends TestCase
{
    use RefreshDatabase;

    private function produtoComEstoque(int $estoque): Product
    {
        return Product::create([
            'name' => 'Bolo de Cenoura',
            'category' => 'Bolos',
            'price' => 40,
            'stock' => $estoque,
            'minimum_stock' => 2,
        ]);
    }

    // Exercício 30
    public function test_pedido_baixa_o_estoque(): void
    {
        $cliente = Customer::create(['name' => 'Cliente Pedido']);
        $produto = $this->produtoComEstoque(10);

        $this->post('/pedidos', [
            'customer_id' => $cliente->id,
            'product_id' => $produto->id,
            'quantity' => 3,
            'status' => 'pending',
        ])->assertRedirect(route('pedidos.index'));

        $this->assertDatabaseHas('orders', ['product_id' => $produto->id, 'quantity' => 3]);
        $this->assertSame(7, $produto->fresh()->stock);
    }

    // Exercício 30
    public function test_pedido_maior_que_o_estoque_nao_e_criado(): void
    {
        $cliente = Customer::create(['name' => 'Cliente Pedido']);
        $produto = $this->produtoComEstoque(10);

        $this->post('/pedidos', [
            'customer_id' => $cliente->id,
            'product_id' => $produto->id,
            'quantity' => 11,
            'status' => 'pending',
        ])->assertSessionHasErrors('quantity');

        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(10, $produto->fresh()->stock);
    }
}
