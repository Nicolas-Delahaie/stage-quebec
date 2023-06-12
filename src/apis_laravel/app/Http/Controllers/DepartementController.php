<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DepartementController extends Controller
{
    // ------ GET ------ //
    public function index()
    {
        return Departement::all();
    }
    public function indexDetaille()
    {
        return Departement::with([
            'coordonnateur' => function ($query) {
                $query->select('id', 'prenom', 'nom');
            },
        ])->get();
    }
    public function indexWithEnseignants()
    {
        $departement = Departement::with([
            'professeurs' => function ($query) {
                $query->select('id', 'prenom', 'nom', 'departement_id');
            },
        ])
        ->select('id', 'nom')
        ->get();

        $professeurs = $departement->pluck('professeurs')->flatten()->sortBy('nom');

        return [
            'departement' => $departement,
            'professeurs' => $professeurs,
        ];        
    }
    public function show($id)
    {
        return Departement::findOrFail($id);
    }
    public function showCoordonnateur($id)
    {
        return Departement::findOrFail($id)->coordonnateur;
    }
    public function showCoursProposesDetailles($id)
    {
        return Departement::findOrFail($id)
            ->with([
                "cours" => function ($query) {
                    $query->with([
                        "professeurs" => function ($query) {
                            $query->select( 'nom','prenom');
                        }
                    ])
                    ->select('id', 'nom','departement_id','ponderation','taille_groupes','nb_groupes');                   
                }
            ])
            ->where('id', $id)
            ->get();
    }
    public function showProfesseurs($id){
        return Departement::
        with([
            'professeurs' => function ($query) {
                $query->select('id', 'nom', 'prenom','departement_id');
            }
        ])
        ->select('id', 'nom')
        ->where('id', $id)
        ->get();
    }
}