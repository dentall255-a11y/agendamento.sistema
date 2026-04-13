<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class ClinicaController extends Controller
{
    public function credenciamento(): View
    {
        return view('clinicas.credenciamento');
    }
}