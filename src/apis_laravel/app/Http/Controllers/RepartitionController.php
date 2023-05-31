<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Repartition;

class RepartitionController extends Controller
{
    public function show($id){
        return Repartition::findOrFail($id);
    }
}
