<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Book::create([
            'titulo' => 'O Senhor dos Anéis',
            'autor' => 'J.R.R. Tolkien',
            'genero' => 'Fantasia',
            'qtd' => 15,
            'preco' => 89.90
        ]);

        Book::create([
            'titulo' => '1984',
            'autor' => 'George Orwell',
            'genero' => 'Ficção Distópica',
            'qtd' => 8,
            'preco' => 45.00
        ]);

        Book::create([
            'titulo' => 'Dom Casmurro',
            'autor' => 'Machado de Assis',
            'genero' => 'Romance',
            'qtd' => 12,
            'preco' => 35.90
        ]);
    }
}
