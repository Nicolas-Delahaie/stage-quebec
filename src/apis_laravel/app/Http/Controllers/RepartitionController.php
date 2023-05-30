<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Repartition;

class RepartitionController extends Controller
{
    public function show($id){
        $repartition = Repartition::findOrFail($id);
        return response($repartition, 200);
    }
}
