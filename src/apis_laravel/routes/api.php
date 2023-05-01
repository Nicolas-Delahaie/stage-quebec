<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */


use App\Http\Resources\UserResource;
use App\Models\User;

/**
 * route retournant les informations d'un utilisateur en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/user/1
 */
Route::get('/user/{id}', function ($id) {
    return new UserResource(User::findOrFail($id));
})->name('/user');


/**
 * route retournant les informations de tous les utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/users
 */
Route::get('/users', function () {
    return UserResource::collection(User::all());
})->name('/users');

/* -------------------------------------------------------------------------- */
/*                              TYPE_UTILISATEUR                              */
/* -------------------------------------------------------------------------- */

use App\Http\Resources\TypeUtilisateurResource;
use App\Models\TypeUtilisateur;

/**
 * route retournant les informations de tous les types d'utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/type_utilisateurs
 */
Route::get('/type_utilisateurs', function () {
    return TypeUtilisateurResource::collection(TypeUtilisateur::all());
})->name('/type_utilisateurs');


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */

use App\Http\Resources\ScenarioResource;
use App\Models\Scenario;


/**
 * route retournant les informations de tous les scénarios sous le format json
 * par exemple : http://localhost:8000/api/scenarios
 */
Route::get('/scenarios', function () {
    return ScenarioResource::collection(Scenario::all());
})->name('/scenarios');

/**
 * route retournant les informations d'un scénario en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/scénario/1
 */
Route::get('scenario/{id}', function ($id) {
    return new ScenarioResource(Scenario::findOrFail($id));
})->name('/scenario');

/* -------------------------------------------------------------------------- */
/*                                     RDV                                    */
/* -------------------------------------------------------------------------- */

use App\Http\Resources\RDVResource;
use App\Models\RDV;

/**
 * route retournant les informations de tous les rdv sous le format json
 * par exemple : http://localhost:8000/api/rdvs
 */
Route::get('/rdvs', function () {
    return RDVResource::collection(RDV::all());
})->name('/rdvs');

/**
 * route retournant les informations d'un rdv en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/rdv/1
 */
Route::get('rdv/{id}', function ($id) {
    return new RDVResource(RDV::findOrFail($id));
})->name('/rdv');

/* -------------------------------------------------------------------------- */
/*                                MODIFICATION                                */
/* -------------------------------------------------------------------------- */

use App\Http\Resources\ModificationResource;
use App\Models\Modification;

/**
 * route retournant les informations de toutes les modifications sous le format json
 * par exemple : http://localhost:8000/api/modifications
 */
Route::get('/modifications', function () {
    return ModificationResource::collection(Modification::all());
})->name('/modifications');

/**
 * route retournant les informations d'une modification en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/modification/1
 */
Route::get('modification/{id}', function ($id) {
    return new ModificationResource(Modification::findOrFail($id));
})->name('/modification');