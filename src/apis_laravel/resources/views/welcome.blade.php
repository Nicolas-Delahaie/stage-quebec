<!DOCTYPE html>
<html>
<head>
    <title>API Laravel</title>
</head>
<body>
    <h1>Bienvenue sur l'api Laravel</h1>
    <p>Voici les urls que propose cette API</p>
    <h2>Utilisateurs</h2>
    <ul>
        <li>
            <a href="{{ route('/users')}}">Infos de tous les utilisateurs</a>
        </li>
        <li>
            <a href="{{ route('/user', ['id' => 1] )}}">Infos de l'utilisateur 1</a>
        </li>
    </ul>
    <h2>Types d'utilisateurs</h2>
    <ul>
        <li>
            <a href="{{ route('/type_utilisateurs')}}">Infos de tous les types d'utilisateurs</a>
        </li>
    </ul>
    <h2>Scénarios</h2>
    <li>
        <a href="{{ route('/scenarios')}}">Infos de tous les scénarios</a>
    </li>
    <li>
        <a href="{{ route('/scenario', ['id' => 1])}}">Infos du scénario 1</a>
    </li>
    <h2>RDV</h2>
    <li>
        <a href="{{ route('/rdvs')}}">Infos de tous les RDV</a>
    </li>
    <li>
        <a href="{{ route('/rdv', ['id' => 1])}}">Infos du RDV 1</a>
    </li>
    <h2>Modifications</h2>
    <ul>
        <li>
            <a href="{{ route('/modifications')}}">Infos de toutes les modifications de scénarios</a>
        </li>
        <li>
            <a href="{{ route('/modification', ['id' => 1] )}}">Infos de la modification 1</a>
        </li>
    </ul>
</body> 
</html>
