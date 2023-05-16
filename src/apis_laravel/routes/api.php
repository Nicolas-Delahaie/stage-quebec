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

Route::get('/cours', [CoursController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/cours/{id}', [CoursController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/cours/{id}/enseignants', [CoursController::class, 'showEnseignants'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/cours/{id}/departements', [CoursController::class, 'showDepartements'])->middleware(['auth:sanctum', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                DEPARTEMENT                                 */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\DepartementController;

Route::get('/departements', [DepartementController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/departementsDetaille', [DepartementController::class, 'showCoordonnateurs'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/departements/{id}', [DepartementController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/departements/{id}/coordonnateur', [DepartementController::class, 'showCoordonnateur'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/departements/{id}/cours', [DepartementController::class, 'showCours'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/departements/{id}/scenarios', [DepartementController::class, 'showScenarios'])->middleware(['auth:sanctum', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                LIBERATION                                  */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\LiberationController;

Route::get('/liberations', [LiberationController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/liberations/{id}', [LiberationController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/liberations/{id}/users', [LiberationController::class, 'showUsers'])->middleware(['auth:sanctum', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                MODIFICATION                                */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\ModificationController;

Route::get('modifications', [ModificationController::class, 'index'])->middleware('auth:sanctum');
Route::get('modifications/{id}', [ModificationController::class, 'show'])->middleware('auth:sanctum');
Route::get('modifications/{id}/user', [ModificationController::class, 'showUser'])->middleware('auth:sanctum');
Route::get('modifications/{id}/scenario', [ModificationController::class, 'showScenario'])->middleware('auth:sanctum');


/* -------------------------------------------------------------------------- */
/*                                     RDV                                    */
/* -------------------------------------------------------------------------- */
use App\HTTP\Controllers\RDVController;

Route::get('rdvs', [RDVController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('rdvs/{id}', [RDVController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('rdvs/{id}/scenario', [RDVController::class, 'showScenario'])->middleware(['auth:sanctum', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\ScenarioController;

Route::get('scenarios', [ScenarioController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}', [ScenarioController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/detaille', [ScenarioController::class, 'showDetails'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/departement', [ScenarioController::class, 'showDepartement'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/proprietaire', [ScenarioController::class, 'showProprietaire'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/rdvs', [ScenarioController::class, 'showRDVs'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/modifications', [ScenarioController::class, 'showModifications'])->middleware(['auth:sanctum', 'responsable']);
Route::get('scenarios/{id}/repartition', [ScenarioController::class, 'showRepartition'])->middleware(['auth:sanctum', 'responsable']);

/* -------------------------------------------------------------------------- */
/*                              TYPE_UTILISATEUR                              */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\TypeUtilisateurController;

Route::get('/types_utilisateur', [TypeUtilisateurController::class, 'index'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/types_utilisateur/{id}', [TypeUtilisateurController::class, 'show'])->middleware(['auth:sanctum', 'responsable']);
Route::get('/types_utilisateur/{id}/users', [TypeUtilisateurController::class, 'showUsers'])->middleware(['auth:sanctum', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index'])->middleware(['auth:sanctum','responsable']);
Route::get('/users/{id}', [UserController::class,'show'])->middleware('auth:sanctum');
Route::get('/users/{id}/type', [UserController::class,'showType'])->middleware('auth:sanctum');
Route::get('/users/{id}/liberations', [UserController::class,'showLiberations'])->middleware('auth:sanctum');
Route::get('/users/{id}/modifications', [UserController::class,'showModifications'])->middleware('auth:sanctum');
Route::get('/users/{id}/cours', [UserController::class,'showCours'])->middleware('auth:sanctum');
Route::get('/users/{id}/scenarios', [UserController::class,'showScenarios'])->middleware('auth:sanctum');

/**
 * @warning A supprimer : On recopie manuelleement la meme fonction que scenarioDetaille
 */
Route::get('/users/{id}/scenariosDetailles', [UserController::class,'showScenariosDetailles']);


/* -------------------------------------------------------------------------- */
/*                             APIS POUR LES PAGES                            */
/* -------------------------------------------------------------------------- */
/* ------------------------------ DEPARTEMENTS ------------------------------ */


/* -------------------------------- SCENARIOS ------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                    AUTRE                                   */
/* -------------------------------------------------------------------------- */
Route::post('/login', [UserController::class, 'login']);
