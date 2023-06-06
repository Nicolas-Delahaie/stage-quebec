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
     * @brief Retourne le scenario de maniere detaillee
     * @param $id : id du scenario
     * @return Scenario 
     */
    public function showDetails($id)
    {
        $scenario = Scenario::with(
            [
                'proprietaire' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
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
                    $query->select('id', 'name');
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
                                ->select('id', 'name', 'statut');
                        }
                    ])
                        ->select('id', 'cours_propose_id', 'professeur_id');
                }
            ])
            ->select('id', 'id_enseigner', 'nbGroupes', 'preparation')
            ->get();

        return $repartition;
    }

    public function showProfesseurs($id){
        return Scenario::findOrFail($id)->
        with(['departement' => function($query){
            $query->with(['professeurs' => function($query){
                $query->with(['liberations' => function($query){
                    $query->select('motif');
                }])
                ->select('id', 'name', 'statut', 'departement_id');
            }])
            ->select('id', 'nom');
        }])
        ->select('id', 'departement_id')
        ->get();
    }
}