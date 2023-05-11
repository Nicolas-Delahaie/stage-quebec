<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; /** @todo retirer ça */

class UserController extends Controller
{
    public function index(){
        return User::all();
    }

    public function show($id){
        return User::findOrFail($id);
    }
    public function showType($id){
        return User::findOrFail($id)->type->toJson();
    }
    public function showLiberations($id){
        return User::findOrFail($id)->liberations->toJson();
    }
    public function showModifications($id){
        return User::findOrFail($id)->modifications->toJson();
    }
    public function showCours($id){
        return User::findOrFail($id)->cours->toJson();
    }
    public function showScenarios($id){
        return User::findOrFail($id)->scenarios->toJson();
    }
    public function showScenarioDetailles($id){
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
     * Create User
     * @param Request $request
     * @return User 
     */
    public function store(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make($request->all(), 
            [
                'name' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function login(Request $request)
    {
        try {
            // -- Validation des parametres --
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            // -- Verification des identifiants --
            $user = User::where('email', $request->email)->first();
            if($user && Hash::check($request->password, $user->password)){
                // Identifiants bons
                $token = $user->createToken("userToken");   //Fabrication du token
                /** @todo Supprimer api_token qui est une copie de personal_access_token */
                $user->api_token = $token->plainTextToken;  //On met le jeton genere dans personnal_access_tokens dans api_token de l utilisateur
                $user->save();
                return response(['token' => $token], 299);
            }
            else{
                // Mauvais identifiants
                return response(['message' => 'Mauvais identifiants'], 401);    
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