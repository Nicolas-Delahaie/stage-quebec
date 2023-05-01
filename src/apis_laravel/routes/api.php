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


use App\Http\Controllers\UserController;

/**
 * route retournant les informations de tous les utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/users
 */
Route::get('/users', [UserController::class, 'index'])->name('/users');

/**
 * route retournant les informations d'un utilisateur en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/user/1
 */
Route::get('/user/{id}', [UserController::class,'show'])->name('/user');

/* -------------------------------------------------------------------------- */
/*                              TYPE_UTILISATEUR                              */
/* -------------------------------------------------------------------------- */

use App\Http\Controllers\TypeUtilisateurController;

/**
 * route retournant les informations de tous les types d'utilisateurs sous le format json
 * par exemple : http://localhost:8000/api/type_utilisateurs
 */
Route::get('/type_utilisateurs', [TypeUtilisateurController::class, 'index'])->name('/type_utilisateurs');


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */

use App\Http\Controllers\ScenarioController;

/**
 * route retournant les informations de tous les scénarios sous le format json
 * par exemple : http://localhost:8000/api/scenarios
 */
Route::get('/scenarios', [ScenarioController::class, 'index'])->name('/scenarios');


/**
 * route retournant les informations d'un scénario en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/scénario/1
 */
Route::get('scenario/{id}', [ScenarioController::class, 'show'])->name('/scenario');

/* -------------------------------------------------------------------------- */
/*                                     RDV                                    */
/* -------------------------------------------------------------------------- */

use App\HTTP\Controllers\RDVController;

/**
 * route retournant les informations de tous les rdv sous le format json
 * par exemple : http://localhost:8000/api/rdvs
 */
Route::get('/rdvs', [RDVController::class, 'index'])->name('/rdvs');

/**
 * route retournant les informations d'un rdv en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/rdv/1
 */
Route::get('rdv/{id}', [RDVController::class, 'show'])->name('/rdv');

/* -------------------------------------------------------------------------- */
/*                                MODIFICATION                                */
/* -------------------------------------------------------------------------- */

use App\HTTP\Controllers\ModificationController;

/**
 * route retournant les informations de toutes les modifications sous le format json
 * par exemple : http://localhost:8000/api/modifications
 */
Route::get('/modifications', [ModificationController::class, 'index'])->name('/modifications');

/**
 * route retournant les informations d'une modification en fonction de son id sous le format json
 * par exemple : http://localhost:8000/api/modification/1
 */
Route::get('modification/{id}', [ModificationController::class, 'show'])->name('/modification');