<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'statut',
        'contraintes',
        'type_utilisateur_id'
    ];


    public function type()
    {
        return $this->belongsTo(TypeUtilisateur::class, "type_utilisateur_id");
    }
    public function liberations()
    {
        return $this->belongsToMany(Liberation::class, "alouer", "utilisateur_id", "liberation_id")
            ->withPivot("annee", "semestre", "tempsAloue")
            ->orderBy("tempsAloue", "desc");
    }
    public function modifications()
    {
        return $this->hasMany(Modification::class, "utilisateur_id");
    }
    public function coursEnseignes()
    {
        return $this->belongsToMany(CoursPropose::class, 'enseigner', 'professeur_id', 'cours_propose_id');
    }
    public function scenariosCrees()
    {
        return $this->hasMany(Scenario::class, 'proprietaire_id');
    }
    public function scenariosModifies()
    {
        return $this->hasManyThrough(Scenario::class, Modification::class, 'utilisateur_id', 'id', 'id', 'scenario_id');
    }

    public function departement(){
        return $this->belongsTo(Departement::class, 'departement_id');
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}