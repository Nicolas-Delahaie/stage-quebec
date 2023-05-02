<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeUtilisateur;

class TypeUtilisateurController extends Controller
{
    public function index(){
        return TypeUtilisateur::all();
    }

    public function show($id){
        return TypeUtilisateur::findOrFail($id);
    }
    public function showUsers($id){
        return TypeUtilisateur::findOrFail($id)->users->toJson();
    }
}
