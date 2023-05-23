<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CoursPropose;

class CoursProposeController extends Controller
{
    public function showCours($id){
        return CoursPropose::findOr($id)->cours->toJson();
    }
    public function showDepartement($id){
        return CoursPropose::find($id)->departement->toJson();
    }

    public function showEnseignants($id){
        return CoursPropose::find($id)->enseignants->toJson();
    }
    
    /**
     * @brief Supprime un cours d'un département
     * @param departement_id
     * @param cours_id
     * @return Response 200 OK
     * @return Response 404 Cours non trouve
     * @return Response 422 Parametres incorrects
     * @return Response 500 Internal Server Error
     */
    public function delete($id){
        try{
            $cours = CoursPropose::find($id);

            if ($cours === null){
                return response(['message' => 'Enregistrement non trouvé'], 404);
            }
            $cours->delete();

            return response(['message' => 'Suppression réussie'], 200);
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
    public function update($id, Request $request){
        try{
            $request->validate([
                'ponderation' => 'required|integer|min:0|max:255', // max value for an unsignedTinyInteger
                'tailleGroupes' => 'required|integer|min:0|max:255', // max value for an unsignedTinyInteger
                'nbGroupes' => 'required|integer|min:0|max:65535' // max value for an unsignedSmallInteger
            ]);

            $cours = CoursPropose::find($id);

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
