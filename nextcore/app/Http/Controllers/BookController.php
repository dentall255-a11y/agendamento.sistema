<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        // Return books wrapped in a 'data' object for front-end JS compatibility
        return response()->json([
            'data' => Book::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'genero' => 'nullable|string|max:255',
            'qtd' => 'required|integer|min:0',
            'preco' => 'required|numeric|min:0',
        ]);

        $book = Book::create($validated);

        return response()->json([
            'message' => 'Livro criado com sucesso!',
            'data' => $book
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'genero' => 'nullable|string|max:255',
            'qtd' => 'required|integer|min:0',
            'preco' => 'required|numeric|min:0',
        ]);

        $book->update($validated);

        return response()->json([
            'message' => 'Livro atualizado com sucesso!',
            'data' => $book
        ]);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();

        return response()->json([
            'message' => 'Livro deletado com sucesso!'
        ]);
    }
}
