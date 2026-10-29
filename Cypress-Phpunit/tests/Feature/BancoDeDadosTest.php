<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BancoDeDadosTest extends TestCase
{
    use RefreshDatabase;

    // Exercício 26
    public function test_produto_criado_existe_no_banco(): void
    {
        Product::create([
            'name' => 'Brownie',
            'category' => 'Doces',
            'price' => 12.50,
            'stock' => 30,
            'minimum_stock' => 5,
        ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Brownie',
            'category' => 'Doces',
            'stock' => 30,
        ]);
    }
}
