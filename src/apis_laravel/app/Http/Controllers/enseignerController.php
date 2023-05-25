<?php

namespace App\Http\Controllers;
use App\Models\Enseigner;

use Illuminate\Http\Request;

class enseignerController extends Controller
{
    public function store(Request $request){
        try{
            $prof_id = $request->input('professeur_id');
            $cours_propose_id = $request->input('cours_propose_id');
    
            $existeDeja = Enseigner::where('professeur_id', $prof_id)
                ->where('cours_propose_id', $cours_propose_id)
                ->exists();
    
            if ($existeDeja){
                return response(['error' => 'Enregistrement déjà existant'], 409);
            }
    
            $nouveauCours = new Enseigner([
                'professeur_id' => $prof_id,
                'cours_propose_id' => $cours_propose_id,
            ]);
            $nouveauCours->save();
    
            return response(['message' => 'Enregistrement réussi'], 201);
        }
        catch(Throwable $e){
            return response(['message' => $e->getMessage()], 500);
        }
    }

    public function delete(Request $req){
        Enseigner::where('professeur_id', $req->input('professeur_id'))
            ->where('cours_propose_id', $req->input('cours_propose_id'))
            ->delete();
        return response(['message' => 'Suppression réussie'], 200);
    }
}
