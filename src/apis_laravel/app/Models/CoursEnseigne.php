<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoursEnseigne extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'cours_enseigne';

    protected $fillable = [
        'cours_id',
        'user_id',
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }

    public function professeur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}