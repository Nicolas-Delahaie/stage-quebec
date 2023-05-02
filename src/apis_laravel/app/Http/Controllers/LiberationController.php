<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Liberation;

class LiberationController extends Controller
{
    public function index(){
        return Liberation::all();
    } 

    public function show($id){
        return Liberation::find($id);
    }
    public function showUsers($id){
        return Liberation::find($id)->users->toJson();
    }
}
