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
    
    public function getCoordonnateur(){
        return $this->belongsTo(User::class, "coordonnateur_id");
    }
}