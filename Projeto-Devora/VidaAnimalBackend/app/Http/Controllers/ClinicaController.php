<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClinicaController extends Controller
{
    public function credenciamento()
    {
        return view('credenciamento');
    }
}