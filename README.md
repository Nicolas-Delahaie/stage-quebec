# Stage_Quebec

## Presentation

Stage en informatique de 10 semaines au Quebec. Développement d'un outil de gestion des cours pour les professeurs. Projet de A à Z en équipe de 2.

Les cas d'utilisation ont été rédigés avec notre maitre de stage pour convenir aux besoins. Il sont trouvables dans les diagrammes des cas d'utilisations (dans docs). Ces derniers ont été intégrés, sauf quelques uns, empêchant l'application d'atteindre le MVP à terme (Minimum Viable Product).

De plus, le changement majeur de la structure des données initié en fin de stage n'a pas pu être achevé. Le travail est stocké dans la branche "ModificationsBDD".

Les APIs sont gérées via Laravel et le front est développé grâce à ReactJS.

## Lancement

Après de nombreux essais en vain, et ayant passé trop de temps dessus, j'ai abandonné la tentative d'utilisation de Docker pour lier React et Laravel. A la place, on peut l'utiliser seulement pour la base de données MySQL, avec un support phpmyadmin.

A la place, on doit lancer séparément les 3 composantes de ce projet dans l'ordre suivant.

### Base de données

La base de données peut être instanciée via la commande `docker-compose up` dans le dossier du `docker-compose.yml`.

### Laravel

- Se déplacer dans le dossier `laravel/`
- Configurer le fichier .env avec les identifiants de la BDD si besoins
- `php artisan migrate --seed` pour générer la structure et peupler la BDD
- `php artisan serve` pour lancer le serveur

### React

Lorsque les APIs sont en place, il suffit de se déplacer dans le dossier `react/` et d'exécuter les commandes `npm i` puis `npm start` pour lancer le serveur react.

## Utilisation

Il existe 3 types d'utilisateurs, avec pour chacun un mail :

- root@root.root pour être admin
- root2@root.root pour être responsable
- root3@root.root pour être enseignant

Tous les identifiants root ont le même mdp : "root".
Il faut tester avec root 1, 2 et 3 pour avoir des actions différentes.
