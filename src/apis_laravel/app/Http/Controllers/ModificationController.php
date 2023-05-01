<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Modification;

class ModificationController extends Controller
{
    public function index()
    {
        return Modification::all();
    }
    public function show($id)
    {
        return Modification::find($id);
    }
}
