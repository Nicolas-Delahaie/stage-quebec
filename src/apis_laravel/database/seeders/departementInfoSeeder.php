<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \App\Models\Departement;
use \App\Models\Cours;
use \App\Models\Liberation;
use \App\Models\Alouer;
use \App\Models\Scenario;
use \App\Models\CoursEnseigne;

class departementInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //TEMPORAIRES 
        $type_utilisateurs = [
            ["nom" => "administrateur"],
            ["nom" => "responsable"],
            ["nom" => "professeur"]
        ];
        foreach ($type_utilisateurs as $val) {
            \App\Models\TypeUtilisateur::create($val);
        }
        $liberations = [
            ["motif" => "PVRTT"],
            ["motif" => "Coord. Dept"],
            ["motif" => "Coord. Programme"],
            ["motif" => "ESR"],
            ["motif" => "Club Sécurité"],
            ["motif" => "Recherche stages FR"],
            ["motif" => "Élaboration SCIM"],
        ];
        foreach ($liberations as $val) {
            Liberation::create($val);
        }


        // DEPARTEMENT
        $deptInfo = Departement::create(["nom" => "Informatique", "nbEleves" => 100, "coordonnateur_id" => null]);


        // SCENARIO
        $scenario = Scenario::create(["aEteValide" => false, "annee" => 2023, "session" => 1, "departement_id" => $deptInfo->id]);


        // COURS
        $coursInfo = [
            ["nom" => 'Introduction à l\'informatique',              "nb_groupes" => 4, "taille_groupes" => 19.75, "ponderation" => 3],
            ["nom" => 'Introduction au développement web',           "nb_groupes" => 4, "taille_groupes" => 22, "ponderation" => 4],
            ["nom" => 'Algorithmie et programmation structurée',     "nb_groupes" => 4, "taille_groupes" => 19.75, "ponderation" => 6],
            ["nom" => 'Outils logiciels',                            "nb_groupes" => 1, "taille_groupes" => 12, "ponderation" => 3],
            ["nom" => 'Introduction à la réseautique',               "nb_groupes" => 2, "taille_groupes" => 16.50, "ponderation" => 3],
            ["nom" => 'Structure de données et algorithmie avancée', "nb_groupes" => 1, "taille_groupes" => 26, "ponderation" => 4],
            ["nom" => 'Programmation système',                       "nb_groupes" => 2, "taille_groupes" => 16, "ponderation" => 6],
            ["nom" => 'Développement web côté client',               "nb_groupes" => 2, "taille_groupes" => 14, "ponderation" => 4],
            ["nom" => 'Développement mobile',                        "nb_groupes" => 1, "taille_groupes" => 25, "ponderation" => 4],
            ["nom" => 'Programme de jeux 3D',                        "nb_groupes" => 1, "taille_groupes" => 22, "ponderation" => 4],
            ["nom" => 'Développement multiplateforme',               "nb_groupes" => 1, "taille_groupes" => 27, "ponderation" => 6],
            ["nom" => 'Objets connectés',                            "nb_groupes" => 1, "taille_groupes" => 23, "ponderation" => 4],
            ["nom" => 'Développement et implantation de projets',    "nb_groupes" => 1, "taille_groupes" => 26, "ponderation" => 6],
            ["nom" => 'Développement mobile avancé',                 "nb_groupes" => 1, "taille_groupes" => 23, "ponderation" => 4],
            ["nom" => 'Nouvelles technologies',                      "nb_groupes" => 1, "taille_groupes" => 26, "ponderation" => 4],
            ["nom" => 'Introduction à la programmation SCIM',        "nb_groupes" => 1, "taille_groupes" => 22, "ponderation" => 5],
            ["nom" => 'De la puce aux TIC !',                        "nb_groupes" => 2, "taille_groupes" => 24, "ponderation" => 3],
        ];
        foreach ($coursInfo as $cours) {
            $cours["departement_id"] = $deptInfo->id;
            Cours::create($cours);
        }


        // USERS
        $users = [
            ["prenom" => "Sandra", "nom" => "Béland", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Patrick", "nom" => "McGrail", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Suzette", "nom" => "Neveu", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Saint-Thomas", "nom" => "Trudeau", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Frederic", "nom" => "Guérin", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Kati", "nom" => "Bessette", "statut" => "P","type_utilisateur_id" => 3],
            ["prenom" => "Maya", "nom" => "Bouthillier", "statut" => "TP", "estCoordo" => true,"type_utilisateur_id" => 3],
            ["prenom" => "Sebastien", "nom" => "Huot", "statut" => "TP","type_utilisateur_id" => 3],
            ["prenom" => "Olivier", "nom" => "Fortin", "statut" => "TP","type_utilisateur_id" => 3],
            ["prenom" => "A", "nom" => "Prof", "statut" => "TP","type_utilisateur_id" => 3],
            ["prenom" => "B", "nom" => "Prof", "statut" => "TP","type_utilisateur_id" => 3],
        ];
        foreach ($users as $user) {
            $user["email"] = $user["prenom"][0] . strtolower($user["nom"]) . "@gmail.com";
            $user["password"] = bcrypt("password");
            $user["type_utilisateur_id"] = 1;
            $user["departement_id"] = 1;
            \App\Models\User::create($user);
        }


        // ALOUER
        $alouer = [
            ["tempsAloue" => 0.355, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 2],
            ["tempsAloue" => 0.100, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 3],
            ["tempsAloue" => 0.205, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 4],
            ["tempsAloue" => 0.050, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 4, "liberation_id" => 5],
            ["tempsAloue" => 0.050, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 9, "liberation_id" => 5],
            ["tempsAloue" => 0.255, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 3, "liberation_id" => 6],
            ["tempsAloue" => 0.100, "annee" => 2023, "semestre" => 1, "utilisateur_id" => 2, "liberation_id" => 7],
        ];
        foreach ($alouer as $val) {
            Alouer::create($val);
        }


        // COURS_ENSEIGNES
        $coursEnseignes = [
            ["cours_id" => 1, "user_id" => 1, "nb_groupes" => 2],
            ["cours_id" => 1, "user_id" => 7, "nb_groupes" => 2],
            ["cours_id" => 2, "user_id" => 1, "nb_groupes" => 1],
            ["cours_id" => 2, "user_id" => 6, "nb_groupes" => 1],
            ["cours_id" => 2, "user_id" => 9, "nb_groupes" => 1],
            ["cours_id" => 2, "user_id" => 10, "nb_groupes" => 1],
            ["cours_id" => 3, "user_id" => 3, "nb_groupes" => 2],
            ["cours_id" => 3, "user_id" => 8, "nb_groupes" => 1],
            ["cours_id" => 3, "user_id" => 9, "nb_groupes" => 1],
            ["cours_id" => 4, "user_id" => 8, "nb_groupes" => 1],
            ["cours_id" => 5, "user_id" => 2, "nb_groupes" => 2],
            ["cours_id" => 6, "user_id" => 5, "nb_groupes" => 1],
            ["cours_id" => 7, "user_id" => 5, "nb_groupes" => 2],
            ["cours_id" => 8, "user_id" => 6, "nb_groupes" => 2],
            ["cours_id" => 9, "user_id" => 4, "nb_groupes" => 1],
            ["cours_id" => 10, "user_id" => 8, "nb_groupes" => 1],
            ["cours_id" => 11, "user_id" => 4, "nb_groupes" => 1],
            ["cours_id" => 12, "user_id" => 9, "nb_groupes" => 1],
            ["cours_id" => 13, "user_id" => 6, "nb_groupes" => 1],
            ["cours_id" => 14, "user_id" => 4, "nb_groupes" => 1],
            ["cours_id" => 15, "user_id" => 2, "nb_groupes" => 1],
            ["cours_id" => 16, "user_id" => 2, "nb_groupes" => 1],
            ["cours_id" => 17, "user_id" => 1, "nb_groupes" => 2],
        ];
        foreach ($coursEnseignes as $coursEnseigne) {
            $coursEnseigne["scenario_id"] = $scenario->id;
            CoursEnseigne::create($coursEnseigne);
        }
    }
}