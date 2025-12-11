<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (!Auth::guard('admin')->check()) {
             return response()->json(['error' => 'Unauthorized'], 401);
        }
/*        if ($user->getGuarded() !== 'admins') {
            abort(403, 'unauthorized');
        }*/
        return $next($request);
    }
}
