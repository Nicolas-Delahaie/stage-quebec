<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Scenario;

class ScenarioController extends Controller
{
    public function index()
    {
        return Scenario::all();
    }
    public function show($id)
    {
        return Scenario::find($id);
    }
}
