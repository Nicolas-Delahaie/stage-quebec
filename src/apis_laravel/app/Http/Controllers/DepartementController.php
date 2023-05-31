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
                $query->select('id', 'name');
            },
        ])->get()->toJson();
    }
    public function indexWithEnseignants()
    {
        return Departement::with([
            'coursProposes.enseignants' => function ($query) {
                $query->select('users.id', 'users.name');
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
                    'enseignants' => $enseignants->unique('id')->sortBy("name")->values(),
                ];
            });
    }
    public function show($id)
    {
        return Departement::findOrFail($id);
    }
    public function showCoordonnateur($id)
    {
        return Departement::findOrFail($id)->coordonnateur->toJson();
    }
    public function showCoursProposesDetailles($id)
    {
        return Departement::findOrFail($id)
            ->coursProposes()
            ->with([
                "enseignants" => function ($query) {
                    $query->select('users.id', 'name');
                },
                "cours" => function ($query) {
                    $query->select('cours.id', 'nom');
                },
            ])
            ->get();
    }
}