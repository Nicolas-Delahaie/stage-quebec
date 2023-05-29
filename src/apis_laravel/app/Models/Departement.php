<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;
    protected $table = 'departement';
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $fillable = [
        'nom',
        'nbEleves',
        'coordonnateur_id'
    ];

    public function coordonnateur()
    {
        return $this->belongsTo(User::class, "coordonnateur_id");
    }
    public function coursProposes()
    {
        return $this->hasMany(CoursPropose::class, 'departement_id');
    }
    public function coursProposesDetailles()
    {
        return $this->hasMany(CoursPropose::class, 'departement_id')
            ->with("enseignants")
            ->with("cours");
    }

    public function scenarios()
    {
        return $this->hasMany(Scenario::class, "departement_id");
    }
}