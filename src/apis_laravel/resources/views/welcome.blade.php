<!DOCTYPE html>
<html>
<head>
    <title>API Laravel</title>
</head>
<body>
    <h1>Bienvenue sur l'api Laravel</h1>
    <p>Voici les urls que propose cette API</p>
    <ul>
        <li>
            <a href="{{ route('/users', ['id' => 1] )}}">Infos d'un utilisateur</a>
        </li>
    </ul>
</body> 
</html>
