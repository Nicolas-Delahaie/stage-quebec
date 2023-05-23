<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scenario;
use App\Models\Modification;

class ScenarioController extends Controller
{
    public function index(){
        return Scenario::all();
    }

    public function show($id){
        return Scenario::find($id);
    }
    
    public function showDepartement($id){
        return Scenario::findOrFail($id)->departement->toJson();
    }
    public function showProprietaire($id){
        return Scenario::findOrFail($id)->proprietaire->toJson();
    }
    public function showRDVs($id){
        return Scenario::findOrFail($id)->rdvs->toJson();
    }
    public function showModifications($id){
        return Modification::where('scenario_id', $id)
        ->with('user')
        ->get()
        ->map(function ($modification) {
            return [
                'id' => $modification->id,
                'date_modif' => $modification->date_modif,
                'utilisateur_name' => $modification->user->name,
            ];
        })
        ->toJson();    
    }
    public function showDetails($id){
        $scenario = Scenario::with('proprietaire', 'departement')->findOrFail($id);
        $data = [
            'id' => $scenario->id,
            'aEteValide' => $scenario->aEteValide,
            'annee' => $scenario->annee,
            'created_at' => $scenario->created_at->format('Y-m-d H:i'),
            'updated_at' => $scenario->updated_at->format('Y-m-d H:i'),
            'proprietaire' => [
                'id' => $scenario->proprietaire->id,
                'nom' => $scenario->proprietaire->name,
                'email' => $scenario->proprietaire->email,
            ],
            'departement' => [
                'id' => $scenario->departement->id,
                'nom' => $scenario->departement->nom,
            ],
        ];

        return response()->json($data);
    }

    public function showRepartition($id){
        /*récupération du scénario*/
        $scenario = Scenario::with('departement')->findOrFail($id);

        /*récupération des enseignants liés au scénario*/
        $repartition = $scenario->departement->cours->map(function ($cours) {
            return [
                'id_cours' => $cours->id,
                'nom_cours' => $cours->nom,
                'pivot' => $cours->pivot,
                'enseignants' => $cours->enseignants->map(function ($enseignant) {
                    return [
                        'id_enseignant' => $enseignant->id,
                        'nom_enseignant' => $enseignant->name,
                        'cours' => $enseignant->cours,
                        'email' => $enseignant->email,
                        'liberations' => $enseignant->liberations,
                    ];
                }),
            ];
        });

        /*mise en forme des données*/
        $data = [
            'id' => $scenario->id,
            'aEteValide' => $scenario->aEteValide,
            'departement'=> [
                'id' => $scenario->departement->id,
                'nom' => $scenario->departement->nom,
                'repartition' => $repartition,
            ]

        ];
        return response()->json($data);
    }
}
