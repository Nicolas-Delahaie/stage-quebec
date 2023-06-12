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
        return Departement::with([
            'cours.enseignants' => function ($query) {
                $query->select('users.id', 'users.nom', 'users.prenom');
            }
        ])
            ->get()
            ->sortBy("nom")
            ->values()
            ->map(function ($dept) {
                // On stock tous les enseignants de tous les cours propose (de maniere "flat", c est a dire [prof1, prof2, prof1, prof3] au lieu de [[prof1, prof2], [prof1, prof3]]])
                $enseignants = $dept->coursProposes->flatMap(function ($coursPropose) {
                    return $coursPropose
                        ->enseignants
                        // Suppression du pivot inutile
                        ->map(function ($enseignant) {
                            unset($enseignant->pivot);
                            return $enseignant;
                        });
                });

                return [
                    'id' => $dept->id,
                    'nom' => $dept->nom,
                    'enseignants' => $enseignants->unique('id')->sortBy("nom")->sortBy("prenom")->values(),
                ];
            });
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