<?php

namespace App\Http\Controllers;

use App\Models\Enseigner;
use App\Models\User;
use App\Models\CoursPropose;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class enseignerController extends Controller
{
    // ------- POST ------- /
    /**
     * @brief Assigne un professeur a un cours propose <=>
     * @param Request $request
     * @param int professeur_id id du professeur
     * @param int cours_propose_id id du cours propose
     * @return Response 204, 404, 409, 500
     */
    public function store(Request $request)
    {
        // Verificatoin de la validite des parametres
        try {
            $request->validate([
                'professeur_id' => 'required|integer|min:0|max:65535',
                'cours_propose_id' => 'required|integer|min:0|max:65535',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['message' => 'Mauvais parametres', 'errors' => $e->errors()], 422);
        }
        $prof_id = $request->input('professeur_id');
        $cours_propose_id = $request->input('cours_propose_id');

        // Verification de l existence des cles etrangeres
        User::findOrFail($prof_id);
        CoursPropose::findOrFail($cours_propose_id);

        $existeDeja = Enseigner::where('professeur_id', $prof_id)
            ->where('cours_propose_id', $cours_propose_id)
            ->exists();

        if ($existeDeja) {
            return response(['error' => 'Enregistrement déjà existant'], 409);
        }

        $nouveauCours = new Enseigner([
            'professeur_id' => $prof_id,
            'cours_propose_id' => $cours_propose_id,
        ]);
        $nouveauCours->save();

        return response()->noContent();
    }

    // ------- DELETE ------- /
    /**
     * @brief Retire un utilisateur d un cours propose <=>
     * @param Request $request
     * @param string professeur_id id du professeur
     * @param string cours_propose_id id du cours propose
     * @return Response 200, 404, 422
     */
    public function delete(Request $request)
    {
        try {
            $request->validate([
                'professeur_id' => 'required|integer|min:0|max:65535',
                'cours_propose_id' => 'required|integer|min:0|max:65535',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['message' => 'Mauvais parametres', 'errors' => $e->errors()], 422);
        }

        $enregistrement = Enseigner::where('professeur_id', $request->input('professeur_id'))
            ->where('cours_propose_id', $request->input('cours_propose_id'))->get()->first();

        if (!$enregistrement) {
            return response(['error' => 'Enregistrement inexistant'], 404);
        }
        $enregistrement->delete();

        return response()->noContent();
    }
}