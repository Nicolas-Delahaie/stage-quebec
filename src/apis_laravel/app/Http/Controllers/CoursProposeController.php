<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CoursPropose;
use Illuminate\Http\Response;

class CoursProposeController extends Controller
{
    // ------- DELETE ------- /
    /**
     * @brief Supprime un cours propose
     * @param $id du cours propose
     * @return Response 200, 404, 500
     */
    public function delete($id)
    {
        $cours = CoursPropose::findOrFail($id);
        $cours->delete();

        return response(['message' => 'Suppression réussie'], 200);
    }

    // ------- PUT ------- /
    /**
     * @brief Modifie les attributs d un cours propose
     * @param $id du cours propose
     * @param Request $request  
     * @param string ponderation
     * @param string tailleGroupes
     * @param int nbGroupes
     * @return Response 200, 404, 422, 500
     */
    public function update($id, Request $request)
    {
        // Verification des parametres
        try {
            $request->validate([
                'ponderation' => 'required|integer|min:0|max:255',
                'tailleGroupes' => 'required|integer|min:0|max:255',
                'nbGroupes' => 'required|integer|min:0|max:65535'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['errors' => $e->errors()], 422);
        }

        $cours = CoursPropose::findOrFail($id);
        $cours->update([
            'ponderation' => $request->input('ponderation'),
            'tailleGroupes' => $request->input('tailleGroupes'),
            'nbGroupes' => $request->input('nbGroupes')
        ]);

        return response(['message' => 'Validation réussie'], 200);

    }
}