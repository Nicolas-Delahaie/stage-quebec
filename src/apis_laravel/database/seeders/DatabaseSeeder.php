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
            // LIBERATIONS
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

            // TYPE_UTILISATEURS
            $type_utilisateurs = [
                ["nom" => "administrateur"],
                ["nom" => "responsable"],
                ["nom" => "professeur"]
            ];
            foreach ($type_utilisateurs as $val) {
                TypeUtilisateur::create($val);
            }

            // DEPARTEMENTS
            $departements = [
                ["nom" => "Biologie"],
                ["nom" => "Education Physique"],
                ["nom" => "Analyses Biomedicales"],
                ["nom" => "GTEA"],
                ["nom" => "Soins Infirmiers"],
                ["nom" => "Mathémathiques"],
                ["nom" => "Chimie"],
                ["nom" => "Physique"],
                ["nom" => "Architecture"],
                ["nom" => "Genie Mecanique"],
                ["nom" => "Genie Electronique"],
                ["nom" => "Sciences humaines"],
                ["nom" => "Philisophie"],
                ["nom" => "Techniques Travail Social"],
                ["nom" => "Administration"],
                // ["nom" => "Informatique"],
                ["nom" => "Arts Visuels"],
                ["nom" => "Design Interieur"],
                ["nom" => "Lettres"],
                ["nom" => "Langues Modernes"],
            ];
            foreach ($departements as $departement) {
                $departement["coordonnateur_id"] = null;
                $departement["nb_eleves"] = $faker->numberBetween(20, 300);
                Departement::create($departement);
            }


            // TABLES AVEC 1 DEPENDANCES (2)
            // COURS
            $nomsCours = [
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
            // On attribue a chaque departement un nombre aleatoire de cours
            foreach (Departement::all() as $dept) {
                $nbCours = $faker->numberBetween(4, 10);
                $nomsAleatoire = $faker->randomElements($nomsCours, $nbCours);

                foreach ($nomsAleatoire as $nomCours) {
                    $cours = [];
                    $cours["nom"] = $nomCours["nom"];
                    $cours["nb_groupes"] = $faker->numberBetween(1, 5);
                    $cours["taille_groupes"] = $faker->numberBetween(20, 50);
                    $cours["ponderation"] = $faker->numberBetween(1, 4);
                    $cours["departement_id"] = $dept->id;
                    Cours::create($cours);
                }
            }

            // USERS
            $users = ([
                ["prenom" => "Root", "type_utilisateur_id" => 1,
                ],
                ["prenom" => "Root2", "type_utilisateur_id" => 2],
                ["prenom" => "Root3", "type_utilisateur_id" => 3, "estCoordo" => true],
                ["prenom" => "Root4", "type_utilisateur_id" => 3],
            ]);
            foreach ($users as $user) {
                $user["nom"] = "";
                $user["email"] = $user["prenom"] . "@root.root";
                $user["password"] = bcrypt("root");
                $user["statut"] = "P";
                User::factory()->create($user);
            }
            User::factory(100)->create();

            // On complete les coordonnateurs des departements maintenant qu ils ont ete crees
            foreach (Departement::all() as $departement) {
                // On prend un professeur appartenant au departement au hasard
                $prof = $departement->professeurs()->inRandomOrder()->first();
                if ($prof) {
                    // Un prof existe dans le departement
                    $departement->coordonnateur_id = $prof->id;
                    $departement->save();

                    $prof->estCoordo = true;
                    $prof->save();
                }
            }

            // SCENARIOS
            foreach (Departement::all() as $departement) {
                // On attribue a chaque departement un nombre de scenarios aleatoire
                $nbSessions = $faker->numberBetween(0, 3);
                for ($session = 0; $session < $nbSessions; $session++) {
                    // Pour chaque session de l annee
                    Scenario::create([
                        "aEteValide" => true,
                        "annee" => 2022,
                        "session" => 3 - $session,
                        //Pour partir de la fin de 2022
                        "departement_id" => $departement->id,
                    ]);
                }

                //On ajoute la derniere session qui n est pas valide
                Scenario::create([
                    "aEteValide" => false,
                    "annee" => 2023,
                    "session" => 1,
                    "departement_id" => $departement->id,
                ]);
            }


            // TABLES AVEC 2 DEPENDANCES (3)
            // ALOUER
            foreach (User::all() as $user) {
                //Chaque prof a un nombre aleatoire de liberations
                $nbLiberations = $faker->numberBetween(0, 3);
                $liberations = Liberation::inRandomOrder()->limit($nbLiberations)->get();
                foreach ($liberations as $liberation) {
                    Alouer::create([
                        "temps_aloue" => $faker->numberBetween(0, 500) / 1000,
                        "annee" => rand(0, 1) ? null : $faker->numberBetween(2020, 2026),
                        "semestre" => rand(0, 1) ? null : $faker->numberBetween(1, 2),
                        "utilisateur_id" => $user->id,
                        "liberation_id" => $liberation->id,
                    ]);
                }
            }

            // COURS_ENSEIGNES
            // Dans chaque scenario, tous les cours du departement liés sont enseignés par un ou plusieurs professeurs
            foreach (Scenario::all() as $scenario) {
                // Pour chaque scenario
                $departementtLie = $scenario->departement;

                foreach ($departementtLie->cours as $cours) {
                    //Pour chaque cours du departement lie
                    if ($departementtLie->professeurs()->count() != 0) {
                        // Si le departement a bien des professeurs
                        $nbProfesseurs = $faker->numberBetween(1, 3);
                        $profsAleatoires = $departementtLie->professeurs()->inRandomOrder()->limit($nbProfesseurs)->get();

                        foreach ($profsAleatoires as $prof) {
                            // Pour chaque professeur choisi aleatoirement
                            CoursEnseigne::create([
                                "nb_groupes" => $faker->numberBetween(1, $cours->nb_groupes),
                                "cours_id" => $cours->id,
                                "user_id" => $prof->id,
                                "scenario_id" => $scenario->id,
                            ]);
                        }
                    }
                }
            }

            // MODIFICATIONS
            // On attribue des modifications a chaque scenario
            foreach (Scenario::all() as $scenario) {
                if ($scenario->departement->professeurs()->count() != 0) {
                    // Si le departement du scenario a au moins un professeur (sinon on ne peut pas attribuer de modifications)
                    $nbModifs = $faker->numberBetween(0, 2);
                    for ($i = 0; $i < $nbModifs; $i++) {
                        Modification::create([
                            "date_modif" => $faker->dateTimeBetween($startDate = '2010-01-01', $endDate = 'now'),
                            "explications" => $faker->paragraphs(1, true),
                            "scenario_id" => $scenario->id,
                            "utilisateur_id" => $scenario->departement->coordonnateur()->get()->first()->id,
                        ]);
                    }
                }
            }

            // RDV
            foreach (Scenario::all() as $scenario) {
                // On attribue a chaque scenario entre 0 et 4 rendez-vous
                for ($i = 0; $i < $faker->numberBetween(0, 4); $i++) {
                    Rdv::create([
                        "scenario_id" => $scenario->id,
                        "jour" => $faker->dateTimeBetween($startDate = '20-04-' . $scenario->annee, $endDate = '20-09-' . $scenario->annee),
                        "horaire" => $faker->numberBetween(8, 16) . ":" . $faker->numberBetween(0, 3) * 15
                    ]);
                }
            }


            // TABLES AVEC 3 DEPENDANCES (4)
            // DETAILS_MODIFICATIONS
            // On attribue des details a chaque modifications de chaque scenario
            foreach (Scenario::all() as $scenario) {
                foreach ($scenario->modifications as $modif) {
                    $nbDetails = $faker->numberBetween(0, 10);
                    for ($i = 0; $i < $nbDetails; $i++) {
                        DetailModification::create([
                            "modification_id" => $modif->id,
                            "cours_enseigne_id" => $scenario->coursEnseignes()->inRandomOrder()->first()->id,
                            "old_valeur" => $faker->numberBetween(0, 4),
                            "new_valeur" => $faker->numberBetween(0, 4),
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
            dd($e);
        }
    }
}