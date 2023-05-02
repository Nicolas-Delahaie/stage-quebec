<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Modification;

class ModificationController extends Controller
{
    public function index(){
        return Modification::all();
    }

    public function show($id){
        return Modification::find($id);
    }
    public function showUser($id){
        return Modification::findOrFail($id)->user->toJson();
    }
    public function showScenario($id){
        return Modification::findOrFail($id)->scenario->toJson();
    }
}
