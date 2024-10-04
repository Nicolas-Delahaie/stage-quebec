<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UsersTypeResponsable
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $type = $request->user()->type->nom;
        if ($type === 'administrateur' || $type === 'responsable') {
            return $next($request);
        } else {
            return response(['message' => 'Vous n\'avez pas les droits pour accéder à cette ressource.'], 403);
        }
    }
}