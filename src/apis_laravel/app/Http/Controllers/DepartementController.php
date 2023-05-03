<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;

class DepartementController extends Controller
{
    public function index(){
        return Departement::all();
    } 

    public function show($id){
        return Departement::find($id);
    }
    public function showCoordonnateur($id){
        return Departement::find($id)->coordonnateur->toJson();
    }
    public function showCours($id){
        return Departement::find($id)->cours->toJson();
    }
    public function showScenarios($id){
        return Departement::find($id)->scenarios->toJson();
    }

    public function showCoordonnateurs(){
        $departements = Departement::with('coordonnateur')->get();
        return response()->json($departements);
    }
}
