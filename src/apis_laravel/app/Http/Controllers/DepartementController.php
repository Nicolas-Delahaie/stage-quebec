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
    public function indexDetaille(){
        $departements = Departement::with('coordonnateur')->get();
        return response()->json($departements);
    }

    public function show($id){
        return Departement::find($id);
    }
    public function showCoordonnateur($id){
        return Departement::find($id)->coordonnateur->toJson();
    }
    public function showCoursProposes($id){
        return Departement::find($id)->coursProposes->toJson();
    }
    public function showCoursProposesDetailles($id){
        return Departement::find($id)->coursProposesDetailles->toJson();
    }
    public function showScenarios($id){
        return Departement::find($id)->scenarios->toJson();
    }
    public function showUsers($id){
        $professeurs = DB::table('users')
        ->join('enseigner', 'users.id', '=', 'enseigner.professeur_id')
        ->join('cours_propose', 'cours_propose.id', '=', 'enseigner.cours_propose_id')
        ->where('cours_propose.departement_id', '=', $id)
        ->select('users.id','users.name','enseigner.cours_propose_id','cours.nom')
        ->get();
        return $professeurs;    
    }
}
