<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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

    public function showUsers($id){
        $professeurs = DB::table('users')
        ->join('enseigner', 'users.id', '=', 'enseigner.professeur_id')
        ->join('cours', 'enseigner.cours_id', '=', 'cours.id')
        ->join('proposer', 'cours.id', '=', 'proposer.cours_id')
        ->where('proposer.departement_id', '=', $id)
        ->select('users.id','users.name','enseigner.cours_id','cours.nom')
        ->get();
        return $professeurs;    
    }
}
