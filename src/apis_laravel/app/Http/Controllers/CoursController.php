<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cours;

class CoursController extends Controller
{
    public function index(){
        return Cours::all();
    } 

    public function show($id){
        return Cours::find($id);
    }
    public function showEnseignants($id){
        return Cours::find($id)->enseignants->toJson();
    }
    public function showDepartements($id){
        return Cours::find($id)->departements->toJson();
    }
    public function delete($id){
        $cours = Cours::find($id);
        $cours->delete();
        return $cours;
    }

    public function update(Request $request, $id){
        $cours = Cours::find($id);
        $cours->ponderation = $request->input('ponderation');
        $cours->tailleGroupe = $request->input('tailleGroupe');
        $cours->nbGroupes = $request->input('nbGroupes');
        $cours->save();
        return $cours;
    }
}
