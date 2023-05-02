<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(){
        return User::all();
    }

    public function show($id){
        return User::findOrFail($id);
    }
    public function showType($id){
        return User::findOrFail($id)->type->toJson();
    }
    public function showLiberations($id){
        return User::findOrFail($id)->liberations->toJson();
    }
    public function showModifications($id){
        return User::findOrFail($id)->modifications->toJson();
    }
    public function showCours($id){
        return User::findOrFail($id)->cours->toJson();
    }
    public function showScenarios($id){
        return User::findOrFail($id)->scenarios->toJson();
    }
}
