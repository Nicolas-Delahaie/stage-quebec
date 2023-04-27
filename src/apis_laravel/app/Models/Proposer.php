<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposer extends Model
{
    use HasFactory;
    protected $table = 'proposer';
    protected $fillable = [
        'cours_id',
        'departement_id',
        'ponderation',
        'nbEleves',
        'nbGroupes'
    ];
}
