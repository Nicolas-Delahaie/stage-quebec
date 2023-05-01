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

    public function getProprietaire(){
        return $this->belongsTo(User::class, "proprietaire_id")->first()->name;
    }

    public function getDepartement(){
        return $this->belongsTo(Departement::class, "departement_id")->first()->nom;
    }
}