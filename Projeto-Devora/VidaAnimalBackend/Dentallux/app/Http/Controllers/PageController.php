<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index() {
        return view('welcome'); // Página inicial padrão
    }

    public function frontPage() {
        return view('front.index'); // Onde o front vai trabalhar
    }
}