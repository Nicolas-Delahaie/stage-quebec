<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modification extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'modification';
    protected $fillable = [
        'date_modif',
        'utilisateur_id',
        'scenario_id',
    ];

    public function user(){
        return $this->belongsTo(User::class, "utilisateur_id");
    }
    public function scenario(){
        return $this->belongsTo(Scenario::class, "scenario_id");
    }
}
