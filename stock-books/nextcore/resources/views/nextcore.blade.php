<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Next Core - Gestão de Livros</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <nav>
        <a href="{{ route('home') }}" class="logo">
            <img src="{{ asset('img/logo.jpg') }}" alt="Next Core" class="logo-img">
            Next Core
        </a>
        <ul class="nav-links">
            <li><a href="#inicio">Início</a></li>
            <li><a href="{{ route('segunda') }}">Segunda Tela</a></li>
            <li><a href="#projeto">Projeto</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
        </ul>
    </nav>

    <div class="toast" id="toast"></div>
    <script src="{{ asset('js/script.js') }}" defer></script>
</body>
</html>