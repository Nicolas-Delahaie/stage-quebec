<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Repartition;
use Illuminate\Http\Request;

class RepartitionController extends Controller
{
    /**
     * Renvoie une répartition
     * @param int $id id de la répartition
     * @return \Illuminate\Http\Response 200 si la répartition existe, 404 sinon
     */
    public function show($id){
        $repartition = Repartition::findOrFail($id);
        return response($repartition, 200);
    }

    /**
     * Modifie une répartition
     * @param int $id id de la répartition
     * @param Request $request requête contenant les données à modifier
     * @return \Illuminate\Http\Response 200 si la répartition a été modifiée, 400 sinon
     */
    public function update($id, Request $request){
        try {
            $request->validate([
                "nbGroupes" => "required|integer",
            ]);
        }
        catch(\Illuminate\Validation\ValidationException $e){
            return response($e->errors(), 400);
        }
        $repartition = Repartition::findOrFail($id);
        $repartition->update([
            "nbGroupes" => Intval($request->nbGroupes),
        ]);

        return response($repartition, 200);
    }
}
