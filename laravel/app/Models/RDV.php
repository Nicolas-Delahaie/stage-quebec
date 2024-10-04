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
    ];

    public function scenario(){
        return $this->belongsTo(Scenario::class, "scenario_id");
    }
}
