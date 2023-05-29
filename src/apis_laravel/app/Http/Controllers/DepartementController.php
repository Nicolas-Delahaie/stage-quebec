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