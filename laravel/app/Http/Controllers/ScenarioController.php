<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Scenario;
use App\Models\Modification;
use App\Models\Repartition;


class ScenarioController extends Controller
{
    // ------- GET ------- /
    /**
     * @brief Retourne tous les scenarios de maniere detaillee 
     * @details triés par scénario validé puis par année puis par date de modification
     */
    public function indexDetaille()
    {
        return Scenario::with([
            "departement" => function ($query) {
                $query->with([
                    "coordonnateur" => function ($query) {
                        $query->select('id', 'nom', 'prenom');
                    }
                ])
                    ->select('id', 'nom', 'coordonnateur_id');
            }
        ])
            ->get()
            ->sortByDesc("updated_at")
            ->sortByDesc("annee")
            ->sortBy("aEteValide")
            ->values();
    }
    /**
     * @brief Retourne le scenario de maniere detaillee
     * @param $id : id du scenario
     * @return Scenario 
     */
    public function showDetails($id)
    {
        $scenario = Scenario::with(
            [
                'departement' => function ($query) {
                    $query->select('id', 'nom');
                }
            ]
        )
            ->findOrFail($id);

        return $scenario;
    }
    /**
     * @brief Retourne les modifications associees a un scenario
     * @param $id : id du scenario
     * @return Modification
     */
    public function showModifications($id)
    {
        // Recuperation du scenario
        $scenario = Scenario::findOrFail($id);

        // Recuperation des modifications associees
        return $scenario->modifications()
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'nom', 'prenom');
                }
            ])
            ->select('id', 'date_modif', 'utilisateur_id')
            ->get();
    }
    /**
     * @brief Retourne la repartition d un scenario
     * @param $id : id du scenario
     * @return Repartition
     */
    public function showRepartition($id)
    {
        // Recuperation du scenario
        $scenario = Scenario::findOrFail($id);

        $repartition = $scenario->repartitions()
            ->with([
                'enseigner' => function ($query) {
                    $query->with([
                        'coursPropose' => function ($query) {
                            $query->with([
                                'cours' => function ($query) {
                                    $query->select('id', 'nom');
                                }
                            ])
                                ->select('id', 'tailleGroupes', 'nbGroupes', 'ponderation', 'cours_id');
                        },
                        'professeur' => function ($query) {
                            $query->with([
                                'liberations' => function ($query) {
                                    $query->select('motif');
                                },
                            ])
                                ->select('id', 'nom', 'prenom', 'statut');
                        }
                    ])
                        ->select('id', 'cours_propose_id', 'professeur_id');
                }
            ])
            ->select('id', 'id_enseigner', 'nbGroupes', 'preparation')
            ->get();

        return $repartition;
    }

    public function showProfesseurs($id)
    {
        return Scenario::
            with([
                'departement' => function ($query) {
                    $query->with([
                        'professeurs' => function ($query) {
                            $query->with([
                                'liberations' => function ($query) {
                                    $query->select('motif');
                                }
                            ])
                                ->select('id', 'nom', 'prenom', 'statut', 'departement_id');
                        }
                    ])
                        ->select('id', 'nom');
                }
            ])
            ->where('id', $id)
            ->select('id', 'departement_id')
            ->get();
    }
}