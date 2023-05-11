<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proposer;

class ProposerController extends Controller
{
    /**
     * @brief Supprime un cours d'un département
     * @param departement_id
     * @param cours_id
     * @return Response 200 OK
     * @return Response 404 Cours non trouve
     * @return Response 422 Parametres incorrects
     * @return Response 500 Internal Server Error
     */
    public function delete(Request $request){
        try{
            $request->validate([
                'departement_id' => 'required|integer|min:1',
                'cours_id' => 'required|integer|min:1',
            ]);

            $cours = Proposer::where([
                ['departement_id', '=', $request->input('departement_id')],
                ['cours_id', '=', $request->input('cours_id')]
            ])->first();

            if ($cours === null){
                return response(['message' => 'Enregistrement non trouvé'], 404);
            }
            $cours->delete();

            return response(['message' => 'Suppression réussie'], 200);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['errors' => $e->errors()], 422);
        }
        catch(Throwable $e){
            return response(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * @brief Modifie les attributs du cours d'un département
     * @param departement_id
     * @param cours_id
     * @param ponderation
     * @param tailleGroupes
     * @param nbGroupes
     * @return Response 200 OK
     * @return Response 404 Cours non trouve
     * @return Response 422 Parametres incorrects
     * @return Response 500 Internal Server Error
     */
    public function update(Request $request){
        try{
            $request->validate([
                'departement_id' => 'required|integer|min:1',
                'cours_id' => 'required|integer|min:1',
                'ponderation' => 'required|integer|min:0|max:255', // max value for an unsignedTinyInteger
                'tailleGroupes' => 'required|integer|min:0|max:255', // max value for an unsignedTinyInteger
                'nbGroupes' => 'required|integer|min:0|max:65535' // max value for an unsignedSmallInteger
            ]);

            $cours = Proposer::where([
                ['departement_id', '=', $request->input('departement_id')],
                ['cours_id', '=', $request->input('cours_id')]
            ])->first();

            if ($cours === null){
                return response(['message' => 'Enregistrement non trouvé'], 404);
            }

            $cours->update([
                'ponderation' => $request->input('ponderation'),
                'tailleGroupes' => $request->input('tailleGroupes'),
                'nbGroupes' => $request->input('nbGroupes')
            ]);

            return response(['message' => 'Validation réussie'], 200);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['errors' => $e->errors()], 422);
        }
        catch (Throwable  $e){
            return response(['message' => $e->getMessage], 500);
        }
    }
}
