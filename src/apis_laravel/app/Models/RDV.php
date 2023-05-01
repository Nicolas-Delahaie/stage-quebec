<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDV extends Model
{
    use HasFactory;
    protected $table = 'rdv';
    protected $fillable = [
        'horaire',
        'jour',
        'scenario_id',
        'utilisateur_id',
    ];

    public function getScenario(){
        return $this->belongsTo(Scenario::class, "scenario_id")->first()->id;
    }

    public function getUtilisateur(){
        return $this->belongsTo(User::class, "utilisateur_id")->first()->id;
    }

}
