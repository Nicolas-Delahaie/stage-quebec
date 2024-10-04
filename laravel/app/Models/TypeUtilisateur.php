<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeUtilisateur extends Model
{
    use HasFactory;
    protected $table = 'type_utilisateur';
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)

    protected $fillable = [
        'nom',
    ];

    public function users(){
        return $this->hasMany(User::class, "type_utilisateur_id");
    }
}
