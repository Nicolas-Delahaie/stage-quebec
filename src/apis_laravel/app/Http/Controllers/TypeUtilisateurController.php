<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TypeUtilisateur;

class TypeUtilisateurController extends Controller
{
    public function index()
    {
        return TypeUtilisateur::all();
    }

    public function show($id)
    {
        return TypeUtilisateur::findOrFail($id);
    }
}
