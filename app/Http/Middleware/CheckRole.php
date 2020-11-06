<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role = null)
    {
        $user = $request->user();

        // compare role
        if($user->role !== $role) {
            return response()->json([
                "message" => "Forbidden!"
            ], 403);
        }

        return $next($request);
    }
}
