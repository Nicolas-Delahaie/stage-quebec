<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseigner extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'enseigner';
    protected $fillable = [
        'nbGroupes',
        'cours_propose_id',
        'professeur_id',
        'ponderation'
    ];


}
