<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RDV;

class RDVController extends Controller
{
    public function index(){
        return RDV::all();
    }

    public function show($id){
        return RDV::findOrFail($id);
    }
    public function showScenario($id){
        return RDV::findOrFail($id)->scenario->toJson();
    }
}
