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
use \App\Models\Alouer;
use \App\Models\Rdv;
use \App\Models\Cours;
use \App\Models\Liberation;
use \App\Models\DetailModification;
use \App\Models\CoursEnseigne;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        try {
            $faker = Faker::create();

            // TABLES AVEC 0 DEPENDANCES (1)
            $liberations = [
                ["motif" => "PVRTT"],
                ["motif" => "Congé"],
                ["motif" => "Gestion staiaires"],
            ];
            foreach ($liberations as $val) {
                Liberation::create($val);
            }

            $type_utilisateurs = [
                ["nom" => "administrateur"],
                ["nom" => "responsable"],
                ["nom" => "professeur"]
            ];
            foreach ($type_utilisateurs as $val) {
                TypeUtilisateur::create($val);
            }

            $departements = [
                ["nom" => "Biologie", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Education Physique", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Analyses Biomedicales", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "GTEA", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Soins Infirmiers", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Mathémathiques", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Chimie", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Physique", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Architecture", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Genie Mecanique", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Genie Electronique", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Sciences humaines", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Philisophie", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Techniques Travail Social", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Administration", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Informatique", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Arts Visuels", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Design Interieur", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Lettres", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
                ["nom" => "Langues Modernes", "coordonnateur_id" => $faker->numberBetween(1, User::count()), "nbEleves" => $faker->numberBetween(20, 300)],
            ];
            foreach ($departements as $val) {
                Departement::create($val);
            }


            // TABLES AVEC 1 DEPENDANCES (2)
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
            foreach ($cours as $val) {
                Cours::create($val);
            }

            $users = ([
                ["prenom" => "Root", "nom" => "", "statut" => "P", "email" => "root@root.root", "password" => bcrypt("root"), "type_utilisateur_id" => 1],
                ["prenom" => "Root2", "nom" => "", "statut" => "P", "email" => "root2@root.root", "password" => bcrypt("root"), "type_utilisateur_id" => 2],
                ["prenom" => "Root3", "nom" => "", "statut" => "P", "email" => "root3@root.root", "password" => bcrypt("root"), "type_utilisateur_id" => 3, "estCoordo" => true],
                ["prenom" => "Root4", "nom" => "", "statut" => "P", "email" => "root4@root.root", "password" => bcrypt("root"), "type_utilisateur_id" => 3],
            ]);
            foreach ($users as $val) {
                User::create($val);
            }
            User::factory(20)->create();

            $scenarios = [];
            foreach (Departement::all() as $departement) {
                // On attribue a chaque departement entre 1 et 4 scenarios
                $nbScenarios = $faker->numberBetween(1, 4);
                for ($i = 1; $i < $nbScenarios; $i++) {
                    array_push($scenarios, [
                        "aEteValide" => true,
                        "annee" => 2022 - $i,
                        "departement_id" => $departement->id,
                        "proprietaire_id" => $departement->coordonnateur_id,
                    ]);
                }

                //On ajoute le dernier qui n est pas valide
                array_push($scenarios, [
                    "aEteValide" => false,
                    "annee" => 2022,
                    "departement_id" => $departement->id,
                    "proprietaire_id" => $departement->coordonnateur_id,
                ]);
            }
            foreach ($scenarios as $val) {
                Scenario::create($val);
            }


            // TABLES AVEC 2 DEPENDANCES (3)
            $alouer = [];
            //Chaque prof a entre 0 et 7 liberations
            foreach (User::where("type_utilisateur_id", 3)->get() as $prof) {
                $nbLiberations = $faker->numberBetween(0, 7);
                for ($i = 0; $i < $nbLiberations; $i++) {
                    array_push($alouer, [
                        "tempsALoue" => $faker->numberBetween(0, 1000) / 1000,
                        "annee" => rand(0, 1) ? null : $faker->numberBetween(2021, 2024),
                        "semestre" => rand(0, 1) ? null : $faker->numberBetween(1, 2),
                        "utilisateur_id" => $prof->id,
                        "liberation_id" => $faker->numberBetween(1, Liberation::count()),
                    ]);
                }
            }
            foreach ($alouer as $val) {
                Alouer::create($val);
            }

            $cours_enseignes = [];
            foreach ($cours_enseignes as $val) {
                CoursEnseigne::create($val);
            }

            $modifications = [];
            foreach (Departement::all() as $dept) {
                // On attribue a chaque coordonnateur entre 0 et 4 modifications
                $coordo = $dept->coordonnateur()->get()->first();

                for ($i = 0; $i < $faker->numberBetween(0, 4); $i++) {
                    array_push($modifications, [
                        "scenario_id" => $faker->numberBetween(1, Scenario::count()),
                        "utilisateur_id" => $coordo->id,
                        "date_modif" => $faker->dateTimeBetween($startDate = '2010-01-01', $endDate = 'now'),
                    ]);
                }
            }
            foreach ($modifications as $val) {
                Modification::create($val);
            }

            $rdvs = [];
            foreach (Scenario::all() as $scenario) {
                // On attribue a chaque scenario entre 0 et 4 rendez-vous
                for ($i = 0; $i < $faker->numberBetween(0, 4); $i++) {
                    array_push($rdvs, [
                        "scenario_id" => $scenario->id,
                        "jour" => $faker->dateTimeBetween($startDate = '20-04-' . $scenario->annee, $endDate = '20-09-' . $scenario->annee),
                        "horaire" => $faker->numberBetween(8, 16) . ":" . $faker->numberBetween(0, 3) * 15
                    ]);
                }
            }
            foreach ($rdvs as $val) {
                Rdv::create($val);
            }

            // TABLES AVEC 3 DEPENDANCES (4)
            $detail_modifications = [];
            foreach (Departement::all() as $dep) {
                //Pour chaque departement
                foreach ($dep->scenarios as $scenario) {
                    //Pour chaque scenario departement
                    foreach ($scenario->modifications as $modif) {
                        //Pour chaque modification du scenario
                        $nbDetails = $faker->numberBetween(0, 10);
                        while (count($detail_modifications) < $nbDetails) {
                            // On attribue a chaque modification de chaque scenario de chaque department entre 0 et 10 details
                            $coursProposeAleatoire = $dep->coursProposes()->inRandomOrder()->first();
                            $profAleatoire = $coursProposeAleatoire->enseignants()->inRandomOrder()->first();
                            if ($profAleatoire !== null) {
                                array_push($detail_modifications, [
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
            foreach ($detail_modifications as $val) {
                DetailModification::create($val);
            }

        } catch (\Exception $e) {
            dd($e);
        }
    }
}