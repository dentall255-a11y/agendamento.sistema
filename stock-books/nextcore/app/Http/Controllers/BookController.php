<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller {
    public function index() {
        return response()->json(['data' => Book::all()]);
    }

    public function store(Request $request) {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    public function update(Request $request, $id) {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book);
    }

    public function destroy($id) {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}