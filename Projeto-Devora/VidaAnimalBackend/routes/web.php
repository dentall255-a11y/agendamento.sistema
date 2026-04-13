<?php

use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
use App\Http\Controllers\PageController;

Route::get('/', [PageController::class, 'index'])->name('home');
Route::get('/nova-tela', [PageController::class, 'frontPage'])->name('front.page');
=======
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ClinicaController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/credenciamento', [ClinicaController::class, 'credenciamento'])
    ->name('clinicas.credenciamento');
>>>>>>> e20cc65 (commit v2)
