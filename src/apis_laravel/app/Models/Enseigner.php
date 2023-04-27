<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseigner extends Model
{
    use HasFactory;
    protected $table = 'enseigner';
    protected $fillable = [
        'cours_id',
        'utilisateur_id',
    ];
}
