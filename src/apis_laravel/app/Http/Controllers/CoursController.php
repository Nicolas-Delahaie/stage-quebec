<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cours;

class CoursController extends Controller
{
    public function update(Request $request, $id)
    {
        try{
            $request->validate([
                'ponderation' => 'required|integer',
                'taille_groupes' => 'required|integer',
                'nb_groupes' => 'required|integer',
            ]);
        }
        catch(\Exception $e){
            return response($e->getMessage(), 400);
        }
        $cours = Cours::findOrFail($id);
        $cours->update([
            'ponderation' => Intval($request->ponderation),
            'taille_groupes' => Intval($request->taille_groupes),
            'nb_groupes' => Intval($request->nb_groupes),
        ]);
        return response($cours, 200);
    }
}