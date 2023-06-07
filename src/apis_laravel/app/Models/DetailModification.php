<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailModification extends Model
{
    use HasFactory;
    public $timestamps = false; //Pour que le seeder sache qu'il ne faut pas l initialiser (meme s il n existe pas)
    protected $table = 'detail_modification';

    public function cours_enseigne()
    {
        return $this->belongsTo(CoursEnseigne::class, "cours_enseigne_id");
    }
    public function modification()
    {
        return $this->belongsTo(Modification::class, "modification_id");
    }
}