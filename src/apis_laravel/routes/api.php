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


use App\Models\User;

/**
 * route retournant les informations d'un utilisateur en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/user/1
 */
Route::get('/user/{id}', function ($id) {
    return User::findOrFail($id);
})->name('/user');


/**
 * route retournant les informations de tous les utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/users
 */
Route::get('/users', function () {
    return User::all();
})->name('/users');

/* -------------------------------------------------------------------------- */
/*                              TYPE_UTILISATEUR                              */
/* -------------------------------------------------------------------------- */

use App\Models\TypeUtilisateur;

/**
 * route retournant les informations de tous les types d'utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/type_utilisateurs
 */
Route::get('/type_utilisateurs', function () {
    return TypeUtilisateur::all();
})->name('/type_utilisateurs');


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */

use App\Models\Scenario;


/**
 * route retournant les informations de tous les scénarios sous le format json
 * par exemple : http://localhost:8000/api/scenarios
 */
Route::get('/scenarios', function () {
    return Scenario::all();
})->name('/scenarios');

/**
 * route retournant les informations d'un scénario en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/scénario/1
 */
Route::get('scenario/{id}', function ($id) {
    return Scenario::findOrFail($id);
})->name('/scenario');

/* -------------------------------------------------------------------------- */
/*                                     RDV                                    */
/* -------------------------------------------------------------------------- */

use App\Models\RDV;

/**
 * route retournant les informations de tous les rdv sous le format json
 * par exemple : http://localhost:8000/api/rdvs
 */
Route::get('/rdvs', function () {
    return RDV::all();
})->name('/rdvs');

/**
 * route retournant les informations d'un rdv en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/rdv/1
 */
Route::get('rdv/{id}', function ($id) {
    return RDV::findOrFail($id);
})->name('/rdv');

/* -------------------------------------------------------------------------- */
/*                                MODIFICATION                                */
/* -------------------------------------------------------------------------- */

use App\Models\Modification;

/**
 * route retournant les informations de toutes les modifications sous le format json
 * par exemple : http://localhost:8000/api/modifications
 */
Route::get('/modifications', function () {
    return Modification::all();
})->name('/modifications');

/**
 * route retournant les informations d'une modification en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/modification/1
 */
Route::get('modification/{id}', function ($id) {
    return Modification::findOrFail($id);
})->name('/modification');