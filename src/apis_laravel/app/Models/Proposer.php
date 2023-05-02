<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposer extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'proposer';
    protected $fillable = [
        'cours_id',
        'departement_id',
        'ponderation',
        'tailleGroupes',
        'nbGroupes',
    ];
}
