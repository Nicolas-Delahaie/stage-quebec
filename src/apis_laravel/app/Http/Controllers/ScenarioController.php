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
                $query->select('id', 'nom');
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
        $modifications = $scenario->modifications()
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'nom', 'prenom');
                }
            ])
            ->select('id', 'date_modif', 'utilisateur_id')
            ->get();

        foreach ($modifications as $modification) {
            $modification->date_modif = date('d/m/Y', strtotime($modification->date_modif));
        }

        return $modifications;
    }
    /**
     * @brief Retourne la repartition d un scenario
     * @param $id : id du scenario
     * @return Repartition
     */
    public function showRepartition($id)
    {
        // Recuperation du scenario
        return Scenario::with(["coursEnseignes" => function ($query) {
                $query->with([
                    'professeur' => function ($query) {
                        $query->with([
                            'liberations' => function ($query) {
                                $query->select('motif');
                            }
                        ])
                            ->select('id', 'nom', 'prenom','statut');
                    },
                    'cours' => function ($query) {
                        $query->select('id', 'nom', 'nb_groupes', 'taille_groupes', 'ponderation');
                    }
                ]);
            }])
            ->where('id', $id)
            ->select('id')
            ->get();
    }

    public function showProfesseurs($id){
        return Scenario::
        with(['departement' => function($query){
            $query->with(['professeurs' => function($query){
                $query->with(['liberations' => function($query){
                    $query->select('motif');
                }])
                ->select('id', 'nom','prenom', 'statut', 'departement_id');
            }])
            ->select('id', 'nom');
        }])
        ->where('id', $id)
        ->select('id', 'departement_id')
        ->get();
    }
}