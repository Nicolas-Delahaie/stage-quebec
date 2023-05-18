<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Dotenv\Util\Str;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/** @todo retirer ça */

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }
    public function showType($id)
    {
        return User::findOrFail($id)->type->toJson();
    }
    public function showLiberations($id)
    {
        return User::findOrFail($id)->liberations->toJson();
    }
    public function showModifications($id)
    {
        return User::findOrFail($id)->modifications->toJson();
    }
    public function showCours($id)
    {
        return User::findOrFail($id)->cours->toJson();
    }
    public function showScenarios($id)
    {
        return User::findOrFail($id)->scenarios->toJson();
    }
    public function showScenariosDetailles($id){
        $user = User::findOrFail($id);

        $scenarios = $user->scenarios()
            ->with('proprietaire', 'departement')
            ->get()
            ->map(function ($scenario) {
                return [
                    'id' => $scenario->id,
                    'aEteValide' => $scenario->aEteValide,
                    'annee' => $scenario->annee,
                    'created_at' => $scenario->created_at->format('Y-m-d'),
                    'updated_at' => $scenario->updated_at->format('Y-m-d'),
                    'proprietaire' => [
                        'id' => $scenario->proprietaire->id,
                        'nom' => $scenario->proprietaire->name,
                        'email' => $scenario->proprietaire->email,
                    ],
                    'departement' => [
                        'id' => $scenario->departement->id,
                        'nom' => $scenario->departement->nom,
                    ],
                ];
            })->sortBy('aEteValide')->values()
            ;

        $data = [
            'user' => [
                'id' => $user->id,
                'nom' => $user->name,
                'email' => $user->email,
            ],
            'scenarios' => $scenarios,
        ];

        return response()->json($data);
    }

    public function updateContraintes(Request $request, $id){
        $scenario = User::findOrFail($id);
        $scenario->contraintes = $request->input('contraintes');
        $scenario->save();

        return User::findOrFail($id);
    }


    /**
     * @brief Identifie l utilisateur. Identifiants corrects : cree un token et lui renvoie
     * 
     * @param email string Email de l'utilisateur
     * @param password string Mot de passe en clair
     * @param duration float Duree du token en minutes (entre 1 minute et 100 jours)
     * 
     * @return Response (Voir le code pour les differents cas)
     * @return token string Token de l'utilisateur
     */
    public function login(Request $request)
    {
        try {
            // -- Validation des parametres --
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
                'duration' => 'required|numeric|between:1,144000'       //Entre 1 minute et 100 jours
            ]);

            // -- Verification des identifiants --
            $user = User::where('email', $request->email)->first();
            if($user && Hash::check($request->password, $user->password)){
                // -- Identifiants bons --
                // Création du token
                $token = $user->createToken('userToken');

                // //Ajout de la date d'expiration
                $date_expiration = now()->addMinutes($request->duration);
                $token->accessToken->expires_at = $date_expiration;
                $token->accessToken->save();

                return response(['token' => $token->plainTextToken, 'idUser' => $user->id, 'type' => $user->type, 'message' => 'Utilisateur bien authentifié'], 299);
            }
            else{
                // Mauvais identifiants
                return response(['message' => 'Mot de passe ou mail incorrect'], 401);    
            }
        } 
        catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['message' => 'Mauvais format de reponse', 'errors' => $e->errors()], 422);
        }
        catch (\Throwable $th) {
            return response(['message' => "Erreur inattendue", 'error' => $th->getMessage()], 500);
        }
    }
}