<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class TokenBon
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        // Verification de l existence du token
        if (!$token) {
            return response(['error' => 'Un token d\'authentification est requis'], 401);
        }
        if (strpos($token, "|") === false) {
            return response(['error' => 'Token mal formé. Manque le "|"'], 400);
        }

        // Vérifiez si le token correspond à un token existant dans la base de données
        $token = explode("|", $token);
        $tokenLie = PersonalAccessToken::find($token[0]);
        if (!$tokenLie) {
            return response(['error' => 'Token inexistant en bdd'], 401);
        }
        if ($tokenLie->token !== hash('sha256', $token[1])) {
            return response(['error' => 'Token invalide'], 401);
        }

        return $next($request);
    }
}