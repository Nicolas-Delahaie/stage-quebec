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

Route::get('/users', [UserController::class, 'index'])->middleware(['tokenBon', 'responsable']);
Route::get('/users/responsables', [UserController::class, 'indexResponsables'])->middleware(['tokenBon', 'responsable']);
Route::get('/user/detaille', [UserController::class, 'showUserDetails'])->middleware(['tokenBon']);
Route::get('/user/departement/scenarios_detailles', [UserController::class, 'showDepartementScenariosDetailles'])->middleware('tokenBon');
Route::put('/user/contraintes', [UserController::class, 'updateUserContraintes'])->middleware('tokenBon');
Route::get('/users/{id}/liberations', [UserController::class, 'showLiberations'])->middleware(['tokenBon', 'responsable']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('tokenBon');


/* -------------------------------------------------------------------------- */
/*                               COURS PROPOSE                                */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\CoursProposeController;

Route::delete('/cours_proposes/{id}', [CoursProposeController::class, 'delete'])->middleware(['tokenBon']);
Route::put('/cours_proposes/{id}', [CoursProposeController::class, 'update'])->middleware(['tokenBon']);


/* -------------------------------------------------------------------------- */
/*                                  ENSEIGNER                                 */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\EnseignerController;

Route::post('/enseigner', [EnseignerController::class, 'store'])->middleware(['tokenBon', 'responsable']);
Route::delete('/enseigner', [EnseignerController::class, 'delete'])->middleware(['tokenBon', 'responsable']);


/* -------------------------------------------------------------------------- */
/*                                  SCÉNARIOS                                 */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\ScenarioController;

Route::get('scenarios_detailles', [ScenarioController::class, 'indexDetaille'])->middleware(['tokenBon', 'responsable']);
Route::get('scenarios/{id}/detaille', [ScenarioController::class, 'showDetails'])->middleware('tokenBon');
Route::get('scenarios/{id}/modifications', [ScenarioController::class, 'showModifications'])->middleware('tokenBon');
Route::get('scenarios/{id}/repartition', [ScenarioController::class, 'showRepartition'])->middleware('tokenBon');
Route::get('scenarios/{id}/professeurs', [ScenarioController::class, 'showProfesseurs'])->middleware('tokenBon');

/* -------------------------------------------------------------------------- */
/*                                 REPARTTION                                 */
/* -------------------------------------------------------------------------- */
use App\Http\Controllers\RepartitionController;

Route::post('repartition/{id}', [RepartitionController::class, 'update'])->middleware(['tokenBon', 'responsable']);
Route::delete('repartition/{id}', [RepartitionController::class, 'delete'])->middleware(['tokenBon', 'responsable']);