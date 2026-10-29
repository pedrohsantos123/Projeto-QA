<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProdutoListagemTest extends TestCase
{
    use RefreshDatabase;

    // Exercício 24
    public function test_listagem_exibe_titulo_e_nome_do_produto(): void
    {
        Product::create([
            'name' => 'Torta de Morango',
            'category' => 'Doces',
            'price' => 55,
            'stock' => 8,
            'minimum_stock' => 2,
        ]);

        $this->get('/produtos')
            ->assertOk()
            ->assertSee('Produtos e estoque')
            ->assertSee('Torta de Morango');
    }
}
