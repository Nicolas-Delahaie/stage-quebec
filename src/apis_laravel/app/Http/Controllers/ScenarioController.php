<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scenario;

class ScenarioController extends Controller
{
    public function index(){
        return Scenario::all();
    }

    public function show($id){
        return Scenario::find($id);
    }
    
    public function showDepartement($id){
        return Scenario::findOrFail($id)->departement->toJson();
    }
    public function showProprietaire($id){
        return Scenario::findOrFail($id)->proprietaire->toJson();
    }
    public function showRDVs($id){
        return Scenario::findOrFail($id)->rdvs->toJson();
    }
    public function showModifications($id){
        return Scenario::findOrFail($id)->modifications->toJson();
    }
}
