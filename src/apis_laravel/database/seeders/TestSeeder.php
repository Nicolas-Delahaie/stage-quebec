<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TypeUtilisateur;
use \App\Models\Departement;
use \App\Models\Scenario;
use \App\Models\Modification;
use \App\Models\CoursPropose;
use \App\Models\Enseigner;
use \App\Models\Alouer;
use \App\Models\Rdv;
use \App\Models\Cours;
use \App\Models\Liberation;
use \App\Models\DetailModification;
use \App\Models\Repartition;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try{
            // TABLES AVEC 0 DEPENDANCES
            $type_utilisateur = [
                ["nom" => "administrateur"],
                ["nom" => "responsable"],
                ["nom" => "professeur"]
            ];
            foreach($type_utilisateur as $val){TypeUtilisateur::create($val);}
            
            $cours = [
                ["nom" => 'Introduction à l\'informatique'],
                ["nom" => 'Introduction au développement web'],
                ["nom" => 'Algorithmie et programmation structurée'],
                ["nom" => 'Outils logiciels'],
                ["nom" => 'Introduction à la réseautique'],
                ["nom" => 'Structure de données et algorithmie avancée'],
                ["nom" => 'Programmation système'],
                ["nom" => 'Développement web côté client'],
                ["nom" => 'Développement mobile'],
                ["nom" => 'Programme de jeux 3D'],
                ["nom" => 'Développement multiplateforme'],
                ["nom" => 'Objets connectés'],
                ["nom" => 'Développement et implantation de projets'],
                ["nom" => 'Développement mobile avancé'],
                ["nom" => 'Nouvelles technologies'],
                ["nom" => 'Introduction à la programmation SCIM'],
                ["nom" => 'De la puce aux TIC !'],
            ];
            foreach($cours as $val){Cours::create($val);}

            $liberation = [
                ["motif" => "PVRTT"],
                ["motif" => "Coord. Dept"],
                ["motif" => "Coord. Programme"],
                ["motif" => "ESR"],
                ["motif" => "Club Sécurité"],
                ["motif" => "Recherche stages FR"],
                ["motif" => "Élaboration SCIM"],
            ];
            foreach($liberation as $val){Liberation::create($val);}

            // TABLES AVEC 1 DEPENDANCE


            // TABLES AVEC 2 DEPENDANCES
            $departement=[
                ["nom" => "Informatique", "coordonnateur_id" => null, "nbEleves" => 100]
            ];

            foreach($departement as $val){Departement::create($val);}

            $user =[
                
                ["nom" => "Béland", "email" => "s.beland@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "McGrail", "email" => "p.mcgrail@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Neveu", "email" => "s.neveu@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Trudeau", "email" => "g.trudeau@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Guérin", "email" => "f.guerin@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Bessette", "email" => "k.bessette@gmail.com" , "password" => bcrypt("password"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Bouthillier", "email" => "m.bouthillier@gmail.com" , "password" => bcrypt("password"), "statut" => "TP", "type_utilisateur_id" => 1, "departement_id" => 1,"estCoordo" => true],
                ["nom" => "Huot", "email" => "s.huot@gmail.com" , "password" => bcrypt("password"), "statut" => "TP", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Fortin", "email" => "o.fortin@gmail.com" , "password" => bcrypt("password"), "statut" => "TP", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "ProfA", "email" => "p.profA@gmail.com" , "password" => bcrypt("password"), "statut" => "TP", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "ProfB", "email" => "p.profB@gmail.com" , "password" => bcrypt("password"), "statut" => "TP", "type_utilisateur_id" => 1, "departement_id" => 1],
                ["nom" => "Root","email" => "root@root.root","password" => bcrypt("root"), "statut" => "P", "type_utilisateur_id" => 1, "departement_id" => 1],

            ];
            foreach($user as $val){\App\Models\User::create($val);}

            Departement::where('id', 1)->update(['coordonnateur_id' => 7]);

            $alouer =[
                ["tempsAloue" => 0.355, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 2],
                ["tempsAloue" => 0.100, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 3],
                ["tempsAloue" => 0.205, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 7, "liberation_id" => 4],
                ["tempsAloue" => 0.050, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 4, "liberation_id" => 5],
                ["tempsAloue" => 0.050, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 9, "liberation_id" => 5],
                ["tempsAloue" => 0.255, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 3, "liberation_id" => 6],
                ["tempsAloue" => 0.100, "annee" =>2023, "semestre" => 1, "utilisateur_id" => 2, "liberation_id" => 7],
            ];
            foreach($alouer as $val){Alouer::create($val);}

            $coursProposes=[
                ["cours_id" => 1, "departement_id" => 1, "ponderation" => 3, "tailleGroupes" => 19.75, "nbGroupes" => 4],
                ["cours_id" => 2, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 22, "nbGroupes" => 4],
                ["cours_id" => 3, "departement_id" => 1, "ponderation" => 6, "tailleGroupes" => 19.75, "nbGroupes" => 4],
                ["cours_id" => 4, "departement_id" => 1, "ponderation" => 3, "tailleGroupes" => 12.00, "nbGroupes" => 1],
                ["cours_id" => 5, "departement_id" => 1, "ponderation" => 3, "tailleGroupes" => 16.50, "nbGroupes" => 2],
                ["cours_id" => 6, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 26, "nbGroupes" => 1],
                ["cours_id" => 7, "departement_id" => 1, "ponderation" => 6, "tailleGroupes" => 16, "nbGroupes" => 2],
                ["cours_id" => 8, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 14, "nbGroupes" => 2],
                ["cours_id" => 9, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 25, "nbGroupes" => 1],
                ["cours_id" => 10, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 22, "nbGroupes" => 1],
                ["cours_id" => 11, "departement_id" => 1, "ponderation" => 6, "tailleGroupes" => 27, "nbGroupes" => 1],
                ["cours_id" => 12, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 23, "nbGroupes" => 1],
                ["cours_id" => 13, "departement_id" => 1, "ponderation" => 6, "tailleGroupes" => 26, "nbGroupes" => 1],
                ["cours_id" => 14, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 23, "nbGroupes" => 1],
                ["cours_id" => 15, "departement_id" => 1, "ponderation" => 4, "tailleGroupes" => 26, "nbGroupes" => 1],
                ["cours_id" => 16, "departement_id" => 1, "ponderation" => 5, "tailleGroupes" => 22, "nbGroupes" => 1],
                ["cours_id" => 17, "departement_id" => 1, "ponderation" => 3, "tailleGroupes" => 24, "nbGroupes" => 2],
            ];

            foreach($coursProposes as $val){CoursPropose::create($val);}

            $scenario=[
                ["aEteValide" => false, "annee" => 2023, "departement_id" => 1, "proprietaire_id" => 7]
            ];

            foreach($scenario as $val){Scenario::create($val);}

            

            // TABLES AVEC 4 DEPENDANCES
            $enseigner = [
                ["cours_propose_id" => 1, "professeur_id" => 1],
                ["cours_propose_id" => 1, "professeur_id" => 7],

                ["cours_propose_id" => 2, "professeur_id" => 1],
                ["cours_propose_id" => 2, "professeur_id" => 6],
                ["cours_propose_id" => 2, "professeur_id" => 9],
                ["cours_propose_id" => 2, "professeur_id" => 10],

                ["cours_propose_id" => 3, "professeur_id" => 3],
                ["cours_propose_id" => 3, "professeur_id" => 8],
                ["cours_propose_id" => 3, "professeur_id" => 9],

                ["cours_propose_id" => 4, "professeur_id" => 8],

                ["cours_propose_id" => 5, "professeur_id" => 2],

                ["cours_propose_id" => 6, "professeur_id" => 5],

                ["cours_propose_id" => 7, "professeur_id" => 5],

                ["cours_propose_id" => 8, "professeur_id" => 6],
                
                ["cours_propose_id" => 9, "professeur_id" => 4],
                
                ["cours_propose_id" => 10, "professeur_id" => 8],
                
                ["cours_propose_id" => 11, "professeur_id" => 4],
                
                ["cours_propose_id" => 12, "professeur_id" => 9],
                
                ["cours_propose_id" => 13, "professeur_id" => 6],
                
                ["cours_propose_id" => 14, "professeur_id" => 4],

                ["cours_propose_id" => 15, "professeur_id" => 2],
                
                ["cours_propose_id" => 16, "professeur_id" => 2],
                
                ["cours_propose_id" => 17, "professeur_id" => 1],
            ];

            foreach($enseigner as $val){Enseigner::create($val);}

            $repartition = [
                ["id_enseigner" => 1, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],
                ["id_enseigner" => 2, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],

                ["id_enseigner" => 3, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                ["id_enseigner" => 4, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                ["id_enseigner" => 5, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                ["id_enseigner" => 6, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 7, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],
                ["id_enseigner" => 8, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                ["id_enseigner" => 9, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 10, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 11, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],
                
                ["id_enseigner" => 12, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                
                ["id_enseigner" => 13, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],

                ["id_enseigner" => 14, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],

                ["id_enseigner" => 15, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                
                ["id_enseigner" => 16, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 17, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 18, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                
                ["id_enseigner" => 19, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],
                
                ["id_enseigner" => 20, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 21, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 22, "id_scenario" => 1, "nbGroupes" => 1, "preparation" => 1],

                ["id_enseigner" => 23, "id_scenario" => 1, "nbGroupes" => 2, "preparation" => 1],
            ];
            
            foreach($repartition as $val){Repartition::create($val);}
        }

        catch(\Exception $e){
            echo $e->getMessage();
        }
    }
}
