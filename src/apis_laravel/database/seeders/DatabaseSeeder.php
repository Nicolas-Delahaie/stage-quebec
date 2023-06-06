<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Str; // Pour la fonction Str::random()

use \App\Models\User;
use \App\Models\TypeUtilisateur;
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


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        try{
            $faker = Faker::create();
            
            // TABLES AVEC 0 DEPENDANCES
            $type_utilisateur = [
                ["nom" => "administrateur"],
                ["nom" => "responsable"],
                ["nom" => "professeur"]
            ];
            foreach($type_utilisateur as $val){TypeUtilisateur::create($val);}
            
            $cours = [
                ["nom" => "Mathématiques"],
                ["nom" => "Français"],
                ["nom" => "Histoire"],
                ["nom" => "Anglais"],
                ["nom" => "Sciences physiques"],
                ["nom" => "Sciences naturelles"],
                ["nom" => "Informatique"],
                ["nom" => "Géographie"],
                ["nom" => "Économie"],
                ["nom" => "Philosophie"],
                ["nom" => "Arts"],
                ["nom" => "Musique"],
                ["nom" => "Théâtre"],
                ["nom" => "Journalisme"],
                ["nom" => "Marketing"],
                ["nom" => "Design graphique"],
                ["nom" => "Architecture"],
                ["nom" => "Psychologie"],
                ["nom" => "Sociologie"],
                ["nom" => "Anthropologie"],
                ["nom" => "Droit"],
                ["nom" => "Médecine"],
                ["nom" => "Ingénierie"],
                ["nom" => "Commerce"]
            ];
            foreach($cours as $val){Cours::create($val);}

            $liberation = [
                ["motif" => "PVRTT"],
                ["motif" => "Congé"],
                ["motif" => "Gestion staiaires"],
            ];
            foreach($liberation as $val){Liberation::create($val);}


            // TABLES AVEC 1 DEPENDANCES
            foreach([
                ["name" => "Root","email" => "root@root.root","password" => bcrypt("root"),"statut" => "P", "type_utilisateur_id" => 1],
                ["name" => "Root2","email" => "root2@root.root","password" => bcrypt("root"), "statut" => "P", "type_utilisateur_id" => 2],
                ["name" => "Root3","email" => "root3@root.root","password" => bcrypt("root"), "statut" => "P", "type_utilisateur_id" => 3],
                ] as $val){User::create($val);}
            User::factory(20)->create();


            // TABLES AVEC 2 DEPENDANCES
            $alouer=[];
            //Chaque prof a entre 0 et 7 liberations
            foreach (User::where("type_utilisateur_id", 3)->get() as $prof){
                $nbLiberations = $faker->numberBetween(0, 7);
                for ($i=0; $i < $nbLiberations; $i++) {
                    array_push($alouer, [
                        "tempsALoue" => $faker->numberBetween(0, 1000)/1000,
                        "annee" => rand(0,1) ? null : $faker->numberBetween(2021, 2024),
                        "semestre" => rand(0,1) ? null : $faker->numberBetween(1, 2),
                        "utilisateur_id" => $prof->id,
                        "liberation_id" => $faker->numberBetween(1, Liberation::count()),
                    ]);
                }
            }
            foreach($alouer as $val){Alouer::create($val);}

            $departement=[
                ["nom" => "Biologie", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Education Physique", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Analyses Biomedicales", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "GTEA", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Soins Infirmiers", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Mathémathiques", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Chimie", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Physique", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Architecture", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Genie Mecanique", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Genie Electronique", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Sciences humaines", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Philisophie", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Techniques Travail Social", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Administration", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Informatique", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Arts Visuels", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Design Interieur", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Lettres", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
                ["nom" => "Langues Modernes", "coordonnateur_id"=>$faker->numberBetween(1, User::count()), "nbEleves"=>$faker->numberBetween(20, 300)],
            ];
            foreach($departement as $val){Departement::create($val);}
            

            // TABLES AVEC 3 DEPENDANCES
            $cours_propose = [];
            foreach (Departement::all() as $departement) {
                // -- On attribue a chaque departement entre 3 et 8 cours proposes --

                // On cree un tableau de cours uniques
                $coursProposes = [];
                $nbCours = $faker->numberBetween(3, 8);
                // On s'assure que les cours soient uniques
                while (count($coursProposes) < $nbCours) {
                    $cours = $faker->numberBetween(1, Cours::count());
                    if (!in_array($cours, $coursProposes)){
                        array_push($coursProposes, $cours);
                    }
                }
                
                // On ajoute les cours proposes
                foreach ($coursProposes as $cours){
                    array_push($cours_propose, [
                        "cours_id" => $cours, 
                        "departement_id" => $departement->id, 
                        "ponderation" => $faker->numberBetween(1, 5),
                        "tailleGroupes" => $faker->numberBetween(10, 35),
                        "nbGroupes" => $faker->numberBetween(1, 4),
                    ]);
                }
                
            }
            foreach($cours_propose as $val){CoursPropose::create($val);}

            $scenario = [];
            foreach (Departement::all() as $departement) {
                // On attribue a chaque departement entre 1 et 4 scenarios
                
                $nbScenarios = $faker->numberBetween(1, 4);
                for ($i=1; $i < $nbScenarios; $i++) {
                    array_push($scenario, [
                        "aEteValide" => true,
                        "annee" => 2022 - $i,
                        "departement_id" => $departement->id,
                        "proprietaire_id" => $departement->coordonnateur_id,
                    ]);
                }
                
                //On ajoute le dernier qui n est pas valide
                array_push($scenario, [
                    "aEteValide" => false,
                    "annee" => 2022,
                    "departement_id" => $departement->id,
                    "proprietaire_id" => $departement->coordonnateur_id,
                ]);
            }
            foreach($scenario as $val){Scenario::create($val);}



            // TABLES AVEC 4 DEPENDANCES
            $modification = [];
            foreach (Departement::all() as $dept) {
                // On attribue a chaque coordonnateur entre 0 et 4 modifications
                $coordo = $dept->coordonnateur()->get()->first();

                for ($i=0; $i < $faker->numberBetween(0, 4); $i++) {
                    array_push($modification, [
                        "scenario_id" => $faker->numberBetween(1, Scenario::count()),
                        "utilisateur_id" => $coordo->id,
                        "date_modif" => $faker->dateTimeBetween($startDate = '2010-01-01', $endDate = 'now'),
                    ]);
                }
            }
            foreach($modification as $val){Modification::create($val);}
            
            $rdv = [];
            foreach (Scenario::all() as $scenario){
                // On attribue a chaque scenario entre 0 et 4 rendez-vous
                for ($i=0; $i < $faker->numberBetween(0, 4); $i++) {
                    array_push($rdv, [
                        "scenario_id" => $scenario->id,
                        "jour" => $faker->dateTimeBetween($startDate = '20-04-'.$scenario->annee, $endDate = '20-09-'.$scenario->annee),
                        "horaire" => $faker->numberBetween(8, 16).":".$faker->numberBetween(0,3)*15
                    ]);
                }
            }
            foreach($rdv as $val){Rdv::create($val);}
            
            $enseigner=[];
            // Chaque cours proposé a entre 0 et 5 profs
            foreach(CoursPropose::all() as $coursPropose){
                $nbProfs = $faker->numberBetween(0, 3);

                // On cree un tableau de profs uniques
                $profs = User::where("type_utilisateur_id", 3)->inRandomOrder()->take($nbProfs)->get();

                for ($i=0; $i < $nbProfs; $i++){
                    array_push($enseigner, [
                        "nbGroupes" => $faker->numberBetween(1, 4),
                        "cours_propose_id" => $coursPropose->id, 
                        "professeur_id" => $profs[$i]->id,
                    ]);
                }
            }
            foreach($enseigner as $val){Enseigner::create($val);}


        
            // TABLES AVEC 5 DEPENDANCES
            $details_modification = [];
            foreach (Departement::all() as $dep){
                //Pour chaque departement
                foreach ($dep->scenarios as $scenario){
                    //Pour chaque scenario departement
                    foreach ($scenario->modifications as $modif){
                        //Pour chaque modification du scenario
                        $nbDetails = $faker->numberBetween(0, 10);
                        while (count($details_modification) < $nbDetails) {
                            // On attribue a chaque modification de chaque scenario de chaque department entre 0 et 10 details
                            $coursProposeAleatoire = $dep->coursProposes()->inRandomOrder()->first();
                            $profAleatoire = $coursProposeAleatoire->enseignants()->inRandomOrder()->first();
                            if ($profAleatoire !== null){
                                array_push($details_modification, [
                                    "modification_id" => $modif->id,
                                    "cours_propose_id" => $coursProposeAleatoire->id,
                                    "professeur_id" => $profAleatoire->id,
                                    "oldPonderation" => $faker->numberBetween(0, 4),
                                    "newPonderation" => $faker->numberBetween(0, 4),
                                ]);
                            }
                        }
                    }
                }
            }
            foreach($details_modification as $val){DetailModification::create($val);}

            $repartition = [];
            foreach( Enseigner::all() as $enseigner){

                $nbScenarios = $faker->numberBetween(1, count($enseigner->coursPropose->departement->scenarios));
                $tbScenarios = $enseigner->coursPropose->departement->scenarios;
                for ($i=0; $i < $nbScenarios; $i++) {
                    array_push($repartition, [
                        "id_enseigner" => $enseigner->id,
                        "id_scenario" => $tbScenarios[$i]->id,
                        "nbGroupes" => $faker->numberBetween(1, 4),
                        "preparation" => $faker->numberBetween(1, 4),
                    ]);
                }
            }
            foreach($repartition as $val){Repartition::create($val);}
        }
        catch(\Exception $e){
            dd($e);
        }
    }
}