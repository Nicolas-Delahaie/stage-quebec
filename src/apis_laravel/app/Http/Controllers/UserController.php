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
    /**
     * @brief Renvoie tous les utilisateurs
     * @return Response 200
     */
    public function index()
    {
        return response(User::all(), 200);
    }
    public function indexResponsables()
    {
        $users = User::whereHas('type', function ($query) {
            $query->where('nom', 'responsable');
        })
            ->select('id', 'name')
            ->get()
            ->sortBy('name')
            ->values();

        return $users;
    }
    /**
     * @brief Renvoie les scenarios d un utilisateur de maniere detaillee
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Response 200
     */
    public function showLiberations($id)
    {
        return User::findOrFail($id)->liberations;
    }
    public function showUserScenariosCrees()
    {
        return response(Auth::user()->scenarios, 200);
    }
    /**
     * @brief Renvoie un utilisateur de maniere detaillee 
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Response 200
     */
    public function showUserDetails()
    {
        $user = Auth::user()->load(["type", "liberations", "coursEnseignes"]);
        return response($user, 200);
    }

    // ----- PUT -----
    /**
     * @brief Met a jour les contraintes de l utilisateur
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @param Request requete envoyee par le client avec :
     * @param string contraintes string Contraintes de l'utilisateur
     * @return Response 200, 500
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

        return response(['message' => 'Contraintes bien modifiées'], 200);
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
     * @return Response 299, 401, 422
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

            return response(['token' => $token->plainTextToken, 'type' => $user->type->nom, 'message' => 'Utilisateur bien authentifié'], 299);
        } else {
            // Mauvais identifiants
            return response(['message' => 'Mot de passe ou mail incorrect'], 401);
        }

    }
    /**
     * @brief Déconnecte l'utilisateur lié au token
     * @pre Condition Avoir un token valide lie a un utilisateur 
     * @return Response 299
     */
    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();
        return response(['message' => 'Utilisateur bien déconnecté'], 299);
    }
}