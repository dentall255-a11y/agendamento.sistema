<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

// Apenas a Home
Route::get('/', function () { 
    return view('nextcore'); 
})->name('home');

// API de Livros (Mantenha se for usar o Controller)
Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);
    Route::post('/', [BookController::class, 'store']);
    Route::put('/{id}', [BookController::class, 'update']);
    Route::delete('/{id}', [BookController::class, 'destroy']);
});