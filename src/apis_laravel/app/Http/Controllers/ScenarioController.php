<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scenario;
use Illuminate\Http\Response;
use Nette\Utils\DateTime;

class ScenarioController extends Controller
{
    // ------- GET ------- /
    /**
     * @brief Retourne le scenario de maniere detaillee
     * @param $id : id du scenario
     * @return Response 200
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

        return response($scenario, 200);
    }
    /**
     * @brief Retourne les modifications associees a un scenario
     * @param $id : id du scenario
     * @return Response 200
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

        return response($modifications, 200);
    }
    /**
     * @brief Retourne la repartition d un scenario
     * @param $id : id du scenario
     * @return Response 200
     */
    public function showRepartition($id)
    {
        // Recuperation du scenario
        $scenario = Scenario::findOrFail($id);
        
        $repartition = $scenario->repartitions;

        return response($repartition, 200);
    }
}