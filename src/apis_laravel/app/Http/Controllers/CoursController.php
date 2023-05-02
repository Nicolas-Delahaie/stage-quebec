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
}
