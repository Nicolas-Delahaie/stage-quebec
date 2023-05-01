<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RDV;

class RDVController extends Controller
{
    public function index()
    {
        return RDV::all();
    }

    public function show($id)
    {
        return RDV::findOrFail($id);
    }
}
