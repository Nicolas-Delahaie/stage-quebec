<?php

/**
 * @todo Modifier la migration pour ajouter une clé primaire sur les 2 cles etrangères
 */
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Ressources
use App\Http\Resources\UserResource;

//Modeles
use App\Models\Alouer;
use App\Models\Cours;
use App\Models\Departement;
use App\Models\Enseigner;
use App\Models\Liberation;
use App\Models\Modification;
use App\Models\Proposer;
use App\Models\RDV;
use App\Models\Scenario;
use App\Models\TypeUtilisateur;
use App\Models\User;

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


// COURS
Route::get('/cours', function () {
    return Cours::all();
});
Route::get('/cours/{id}', function ($id) {
    return Cours::findOrFail($id);
});
Route::get('/cours/{id}/enseignants', function ($id) {
    return Cours::findOrFail($id)->enseignants->toJson();
});
Route::get('/cours/{id}/departements', function ($id) {
    return Cours::findOrFail($id)->departements->toJson();
});


// DEPARTEMENT
Route::get('/departements', function () {
    return Departement::all();
});
Route::get('/departements/{id}', function ($id) {
    return Departement::findOrFail($id);
});
Route::get('/departements/{id}/coordonnateur', function ($id) {
    return Departement::findOrFail($id)->coordonnateur->toJson();
});
Route::get('/departements/{id}/cours', function ($id) {
    return Departement::findOrFail($id)->cours->toJson();
});
Route::get('/departements/{id}/scenarios', function ($id) {
    return Departement::findOrFail($id)->scenarios->toJson();
});


// LIBERATION
Route::get('/liberations', function () {
    return Liberation::all();
});
Route::get('/liberations/{id}', function ($id) {
    return Liberation::findOrFail($id);
});
Route::get('/liberations/{id}/users', function ($id) {
    return Liberation::findOrFail($id)->users->toJson();
});


// USER
Route::get('/users/{id}', function ($id) {
    return new UserResource(User::findOrFail($id));
})->name('/users');