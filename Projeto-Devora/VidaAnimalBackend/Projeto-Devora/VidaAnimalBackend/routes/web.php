<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ClinicaController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/credenciamento', [ClinicaController::class, 'credenciamento'])
    ->name('clinicas.credenciamento');