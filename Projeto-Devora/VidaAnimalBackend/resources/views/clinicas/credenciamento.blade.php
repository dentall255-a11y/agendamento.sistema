@extends('layouts.app')

@section('title', 'Credenciamento')

@section('content')
    <h1>Solicitar Credenciamento</h1>

    <form>
        <input type="text" placeholder="Nome da clínica"><br><br>
        <input type="email" placeholder="Email"><br><br>
        <input type="text" placeholder="Telefone"><br><br>
        <button type="submit">Enviar</button>
        <p>Nada certo, coloque essas informações só para teste</p>
    </form>
@endsection