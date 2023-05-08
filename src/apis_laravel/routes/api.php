<?php

/**
 * @todo Modifier la migration pour ajouter une clé primaire sur les 2 cles etrangères
 */
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
/*                                    COURS                                   */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\CoursController;

Route::get('/cours', [CoursController::class, 'index']);
Route::get('/cours/{id}', [CoursController::class, 'show']);
Route::get('/cours/{id}/enseignants', [CoursController::class, 'showEnseignants']);
Route::get('/cours/{id}/departements', [CoursController::class, 'showDepartements']);


/* -------------------------------------------------------------------------- */
/*                                DEPARTEMENT                                 */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\DepartementController;

Route::get('/departements', [DepartementController::class, 'index']);
Route::get('/departements/{id}', [DepartementController::class, 'show']);
Route::get('/departements/{id}/coordonnateur', [DepartementController::class, 'showCoordonnateur']);
Route::get('/departements/{id}/cours', [DepartementController::class, 'showCours']);
Route::get('/departements/{id}/scenarios', [DepartementController::class, 'showScenarios']);
Route::get('/departements/{id}/users', [DepartementController::class, 'showUsers']);


/* -------------------------------------------------------------------------- */
/*                                LIBERATION                                  */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\LiberationController;

Route::get('/liberations', [LiberationController::class, 'index']);
Route::get('/liberations/{id}', [LiberationController::class, 'show']);
Route::get('/liberations/{id}/users', [LiberationController::class, 'showUsers']);


/* -------------------------------------------------------------------------- */
/*                                MODIFICATION                                */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\ModificationController;

Route::get('modifications', [ModificationController::class, 'index']);
Route::get('modifications/{id}', [ModificationController::class, 'show']);
Route::get('modifications/{id}/user', [ModificationController::class, 'showUser']);
Route::get('modifications/{id}/scenario', [ModificationController::class, 'showScenario']);


/* -------------------------------------------------------------------------- */
/*                                     RDV                                    */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\RDVController;

Route::get('rdvs', [RDVController::class, 'index']);
Route::get('rdvs/{id}', [RDVController::class, 'show']);
Route::get('rdvs/{id}/scenario', [RDVController::class, 'showScenario']);


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\ScenarioController;

Route::get('/scenarios', [ScenarioController::class, 'index']);
Route::get('scenarios/{id}', [ScenarioController::class, 'show']);
Route::get('scenarios/{id}/departement', [ScenarioController::class, 'showDepartement']);
Route::get('scenarios/{id}/proprietaire', [ScenarioController::class, 'showProprietaire']);
Route::get('scenarios/{id}/rdvs', [ScenarioController::class, 'showRDVs']);
Route::get('scenarios/{id}/modifications', [ScenarioController::class, 'showModifications']);


/* -------------------------------------------------------------------------- */
/*                              TYPE_UTILISATEUR                              */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\TypeUtilisateurController;

Route::get('/types_utilisateur', [TypeUtilisateurController::class, 'index']);
Route::get('/types_utilisateur/{id}', [TypeUtilisateurController::class, 'show']);
Route::get('/types_utilisateur/{id}/users', [TypeUtilisateurController::class, 'showUsers']);


/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class,'show']);
Route::put('/users/{id}', [UserController::class,'updateContraintes']);
Route::get('/users/{id}/type', [UserController::class,'showType']);
Route::get('/users/{id}/liberations', [UserController::class,'showLiberations']);
Route::get('/users/{id}/modifications', [UserController::class,'showModifications']);
Route::get('/users/{id}/cours', [UserController::class,'showCours']);
Route::get('/users/{id}/scenarios', [UserController::class,'showScenarios']);

/* -------------------------------------------------------------------------- */
/*                             APIS POUR LES PAGES                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------ DEPARTEMENTS ------------------------------ */

Route::get('/departementsDetaille', [DepartementController::class, 'showCoordonnateurs']);

/* -------------------------------- SCENARIOS ------------------------------- */

Route::get('/users/{id}/scenariosDetailles', [UserController::class,'showScenariosDetailles']);
Route::get('/scenarios/{id}/detaille', [ScenarioController::class, 'showDetails']);
