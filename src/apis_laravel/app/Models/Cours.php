<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Cours extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'cours';
    protected $fillable = [
        'nom',
        'nb_groupes',
        'taille_groupes',
        'ponderation',
        'departement_id',
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class, 'departement_id');
    }

    public function professeurs()
    {
        return $this->belongsToMany(User::class, 'cours_enseigne', 'cours_id', 'user_id');
    }
}