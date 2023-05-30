<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoursPropose extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'cours_propose';
    protected $fillable = [
        'cours_propose_id',
        'cours_id',
        'departement_id',
        'ponderation',
        'tailleGroupes',
        'nbGroupes',
    ];

    public function cours(){
        return $this->belongsTo(Cours::class, "cours_id");
    }
    public function departement(){
        return $this->belongsTo(Departement::class, "departement_id");
    }
    public function enseignants(){
        return $this->belongsToMany(User::class, "enseigner", "cours_propose_id", "professeur_id")
            ->withPivot("nbGroupes");
    }
}
