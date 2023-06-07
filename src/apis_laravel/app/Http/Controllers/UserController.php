<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller
{
    // ------- GET ------- /
    public function index()
    {
        return User::all();
    }
    public function indexResponsables()
    {
        $users = User::whereHas('type', function ($query) {
            $query->where('nom', 'responsable');
        })
            ->select('id', 'nom', 'prenom')
            ->get()
            ->sortBy('nom')
            ->sortBy('prenom')
            ->values();

        return $users;
    }
    /**
     * @brief Renvoie les scenarios d un utilisateur de maniere detaillee
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Scenario[]
     */
    public function showUserScenariosCrees()
    {
        return Auth::user()->scenariosCrees;
    }
    /**
     * @brief Renvoie tous les scenarios modifies par un utilisateur de maniere detaillee
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Scenario[]
     */
    public function showUserScenariosModifies()
    {
        return Auth::user()->scenariosModifies;
    }
    public function showLiberations($id)
    {
        return User::findOrFail($id)->liberations;
    }
    /**
     * @brief Renvoie un utilisateur de maniere detaillee 
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return User
     */
    public function showUserDetails()
    {
        return Auth::user()->load(["type", "liberations", "coursEnseignes"]);
    }

    // ----- PUT -----
    /**
     * @brief Met a jour les contraintes de l utilisateur
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @param Request requete envoyee par le client avec :
     * @param string contraintes string Contraintes de l'utilisateur
     * @return Response 204
     */
    public function updateUserContraintes(Request $request)
    {
        $user = Auth::user();
        $newContraintes = $request->input('contraintes');

        // Transformation du corps
        if ($newContraintes === null) {
            // Laravel transforme les corps de requete vides ("") en null donc on le retraduit en chaine vide
            $newContraintes = "";
        }

        // Enregistrement
        $user->contraintes = $newContraintes;
        $user->save();

        return response()->noContent();
    }

    // ------- POST ------- /
    /**
     * @brief Identifie l utilisateur. Identifiants corrects : cree un token et lui renvoie
     * 
     * @param Request requete envoyee par le client avec :
     * @param string email string Email de l'utilisateur
     * @param string password string Mot de passe en clair
     * @param string duration float Duree du token en minutes (entre 1 minute et 100 jours)
     * 
     * @return Response 200, 401, 422
     * @return string token string Token de l'utilisateur
     * @return string type string Type de l'utilisateur
     */
    public function login(Request $request)
    {
        // -- Validation des parametres --
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
                'duration' => 'required|numeric|between:1,144000' //Entre 1 minute et 100 jours
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            //Recupère l erreur de validation des champs
            return response(['message' => 'Mauvais format de reponse', 'errors' => $e->errors()], 422);
        }

        // -- Verification des identifiants --
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            // -- Identifiants bons --
            // Revocation des autres tokens
            $user->tokens()->delete();

            // Création du token
            $token = $user->createToken('userToken');

            // //Ajout de la date d'expiration
            $date_expiration = now()->addMinutes($request->duration);
            $token->accessToken->expires_at = $date_expiration;
            $token->accessToken->save();

            return response(['token' => $token->plainTextToken, 'type' => $user->type->nom, 'estCoordo' => $user->estCoordo, 'message' => 'Utilisateur bien authentifié'], 299);
        } else {
            // Mauvais identifiants
            return response(['message' => 'Mot de passe ou mail incorrect'], 401);
        }

    }
    /**
     * @brief Déconnecte l'utilisateur lié au token
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Response 204
     */
    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();
        return response()->noContent();
    }
}