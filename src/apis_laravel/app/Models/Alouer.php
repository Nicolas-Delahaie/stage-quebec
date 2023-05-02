<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alouer extends Model
{
    use HasFactory;
    protected $table = 'alouer';
    protected $fillable = [
        'utilisateur_id',
        'liberation_id',
        'tempsAloue',
        'annee',
        'semestre',
    ];
}
