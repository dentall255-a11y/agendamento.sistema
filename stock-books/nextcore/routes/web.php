<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

// Páginas
Route::get('/', function () { return view('nextcore'); })->name('home');
Route::get('/segunda-pagina', function () { return view('segunda_pagina'); })->name('segunda');

// API de Livros
Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);
    Route::post('/', [BookController::class, 'store']);
    Route::put('/{id}', [BookController::class, 'update']);
    Route::delete('/{id}', [BookController::class, 'destroy']);
});