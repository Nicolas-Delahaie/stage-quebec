<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scenario extends Model
{
    use HasFactory;
    protected $table = 'scenario';
    protected $fillable = [
        'aEteValide',
        'annee',
        'semestre',
        'proprietaire_id',
        'departement_id',
    ];
    protected $casts = [
        'created_at' => 'datetime:H:i d-m-Y ',
        'updated_at' => 'datetime:H:i d-m-Y',
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class, "departement_id");
    }
    public function rdvs()
    {
        return $this->hasMany(RDV::class, "scenario_id");
    }
    public function modifications()
    {
        return $this->hasMany(Modification::class, "scenario_id");
    }
    public function repartitions()
    {
        return $this->hasMany(Repartition::class, "id_scenario");
    }
}