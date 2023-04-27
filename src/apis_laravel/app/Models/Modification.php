<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modification extends Model
{
    use HasFactory;
    protected $table = 'modification';
    protected $fillable = [
        'utilisateur_id',
        'scenario_id',
    ];
}
