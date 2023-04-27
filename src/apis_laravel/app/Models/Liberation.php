<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Liberation extends Model
{
    use HasFactory;
    protected $table = 'liberation';
    protected $fillable = [
        'motif',
    ];
}
