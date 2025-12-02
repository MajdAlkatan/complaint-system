<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if(Auth::check()){
            activity('user-actions')
                ->causedBy(Auth::user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status' => $response->status()
                ])
                ->log('User ' . Auth::user()->email . ' performed an action');
        }

        return $response;
    }
}