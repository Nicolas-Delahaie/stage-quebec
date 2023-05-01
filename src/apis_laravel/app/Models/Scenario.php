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
}