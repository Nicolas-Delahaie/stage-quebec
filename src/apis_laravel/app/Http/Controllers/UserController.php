<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }
    public function showType($id)
    {
        return User::findOrFail($id)->type->toJson();
    }
    public function showLiberations($id)
    {
        return User::findOrFail($id)->liberations->toJson();
    }
    public function showModifications($id)
    {
        return User::findOrFail($id)->modifications->toJson();
    }
    public function showCours($id)
    {
        return User::findOrFail($id)->cours->toJson();
    }
    public function showScenarios($id)
    {
        return User::findOrFail($id)->scenarios->toJson();
    }
    public function showScenariosDetailles($id)
    {
        $user = User::findOrFail($id);

        $scenarios = $user->scenarios()
            ->with('proprietaire', 'departement')
            ->get()
            ->map(function ($scenario) {
                return [
                    'id' => $scenario->id,
                    'aEteValide' => $scenario->aEteValide,
                    'annee' => $scenario->annee,
                    'created_at' => $scenario->created_at->format('Y-m-d'),
                    'updated_at' => $scenario->updated_at->format('Y-m-d'),
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
            })->sortBy('aEteValide')->values()
            ;

        $data = [
            'user' => [
                'id' => $user->id,
                'nom' => $user->name,
                'email' => $user->email,
            ],
            'scenarios' => $scenarios,
        ];

        return response()->json($data);
    }

    public function updateContraintes(Request $request, $id)
    {
        $scenario = User::findOrFail($id);
    
        $scenario->contraintes = $request->input('contraintes');
    
        $scenario->save();
    
        return User::findOrFail($id);
    }
}
