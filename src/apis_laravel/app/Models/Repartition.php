<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repartition extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = "repartition";

    protected $fillable = [
        "id_repartition",
        "id_enseigner",
        "id_scenario",
        "nbGroupes",
        "preparation"
    ];

    public function enseigner()
    {
        return $this->belongsTo(Enseigner::class, "id_enseigner");
    }

    public function scenario()
    {
        return $this->belongsTo(Scenario::class, "id");
    }

}
