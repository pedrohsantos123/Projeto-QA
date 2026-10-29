<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProdutoValidacaoTest extends TestCase
{
    use RefreshDatabase;

    private function dadosValidos(array $sobrescrever = []): array
    {
        return array_merge([
            'name' => 'Cheesecake',
            'category' => 'Doces',
            'price' => 60,
            'stock' => 10,
            'minimum_stock' => 3,
        ], $sobrescrever);
    }

    // Exercício 28
    public function test_nome_e_obrigatorio(): void
    {
        $this->post('/produtos', $this->dadosValidos(['name' => '']))
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('products', 0);
    }

    // Exercício 28
    public function test_preco_invalido_gera_erro(): void
    {
        $this->post('/produtos', $this->dadosValidos(['price' => 'abc']))
            ->assertSessionHasErrors('price');

        $this->post('/produtos', $this->dadosValidos(['price' => -10]))
            ->assertSessionHasErrors('price');

        $this->assertDatabaseCount('products', 0);
    }

    // Exercício 29 (parte do produto)
    public function test_atualiza_preco_com_put(): void
    {
        $produto = Product::create($this->dadosValidos(['price' => 60]));

        $this->put(route('produtos.update', $produto), $this->dadosValidos(['price' => 75]))
            ->assertRedirect(route('produtos.index'));

        $this->assertDatabaseHas('products', ['id' => $produto->id, 'price' => 75]);
    }
}
